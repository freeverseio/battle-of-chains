import { 
  Chain, 
  Log, 
  User, 
  Asset, 
  ChainActionProposal, 
  AssignOperator, 
  AttackSpecies, 
  DefendSpecies, 
  NFTType, 
  Info 
} from '../db/entity';
import { EventProcessor } from '../processor/process';
import { ChainService } from './chainService';
import { formStorage } from './getDataToStore';
import { DataSource, QueryRunner } from 'typeorm';

const MAX_DB_WRITES_BATCH_SIZE = parseInt(process.env.MAX_DB_WRITES_BATCH_SIZE || "1000", 10);

async function saveInBatches<T>(
  queryRunner: QueryRunner,
  entity: any,
  data: T[],
  batchSize: number,
  entityName: string
): Promise<void> {
  console.time(`Batch write for ${entityName}`);
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    console.log(`Saving batch for ${entityName}, records ${i + 1}-${Math.min(i + batchSize, data.length)} of ${data.length}`);
    await queryRunner.manager.save(entity, batch);
  }
  console.timeEnd(`Batch write for ${entityName}`);
}

async function batchWrite<T>(
  queryRunner: QueryRunner,
  entity: any,
  data: T[],
  entityName: string
): Promise<void> {
  try {
    await queryRunner.startTransaction();
    console.log(`Writing ${entityName}...`);
    await saveInBatches(queryRunner, entity, data, MAX_DB_WRITES_BATCH_SIZE, entityName);
    await queryRunner.commitTransaction();
    console.log(`${entityName} written successfully`);
  } catch (error) {
    console.error(`Error writing ${entityName}:`, error);
    await queryRunner.rollbackTransaction();
    throw error;
  }
}

export async function update(dataSource: DataSource): Promise<number> {
  const chainService = new ChainService(dataSource);

  console.time("Total update process");
  
  // Fetch chains and process events
  console.time("Fetch chains and process events");
  const allChains = await chainService.getAllChains();
  const eventProcessor = new EventProcessor(allChains);
  await eventProcessor.update();
  console.timeEnd("Fetch chains and process events");

  // Prepare data for storage
  console.time("Prepare data for storage");
  const storage = eventProcessor.getStorage();
  const storageToInsert = formStorage(storage);
  console.timeEnd("Prepare data for storage");

  const queryRunner: QueryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();

  try {
    console.log("Truncating tables...");
    console.time("Truncate tables");
    await queryRunner.startTransaction();
    await queryRunner.query(`
      TRUNCATE TABLE public.operator_assignment,
                     public.asset,
                     public.log,
                     public.user,
                     public.chain_action_proposal,
                     public.attack_species,
                     public.defend_species,
                     public.nft_type,
                     public.info
      RESTART IDENTITY CASCADE
    `);
    await queryRunner.commitTransaction();
    console.timeEnd("Truncate tables");

    const independentWrites = Promise.all([
      batchWrite(queryRunner, AttackSpecies, storageToInsert.attackSpecies, "AttackSpecies"),
      batchWrite(queryRunner, DefendSpecies, storageToInsert.defendSpecies, "DefendSpecies"),
      batchWrite(queryRunner, NFTType, storageToInsert.nfttypes, "NFTTypes"),
      batchWrite(queryRunner, Info, storageToInsert.info, "Info")
    ]);

    await independentWrites;
    await batchWrite(queryRunner, Chain, storageToInsert.chains, "Chains");
    await batchWrite(queryRunner, ChainActionProposal, storageToInsert.currentPeriodChainActionProposals, "ChainActionProposals");
    await batchWrite(queryRunner, User, storageToInsert.users, "Users");
    await batchWrite(queryRunner, Asset, storageToInsert.assets, "Assets");
    await batchWrite(queryRunner, Log, storageToInsert.logs, "Logs");
    await batchWrite(queryRunner, AssignOperator, storageToInsert.assignOperators, "AssignOperators");

    console.log("All data written successfully!");
  } catch (error) {
    console.error('Error during update process:', error);
    throw new Error('Failed to process events');
  } finally {
    console.timeEnd("Total update process");
    await queryRunner.release();
  }

  return storageToInsert.users.length +
    storageToInsert.assets.length +
    storageToInsert.currentPeriodChainActionProposals.length +
    storageToInsert.assignOperators.length +
    storageToInsert.logs.length;
}
