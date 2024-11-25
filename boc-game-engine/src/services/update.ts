import { Chain, Log, User, Asset, ChainActionProposal, AssignOperator, AttackSpecies, DefendSpecies, NFTType, Info } from '../db/entity';
import { EventProcessor } from '../processor/process';
import { ChainService } from './chainService';
import { formStorage } from './getDataToStore';
import { DataSource, QueryRunner } from 'typeorm';

const MAX_DB_WRITES_BATCH_SIZE = parseInt(process.env.MAX_DB_WRITES_BATCH_SIZE || "1000", 10);

export async function update(dataSource: DataSource): Promise<number> {
  const chainService = new ChainService(dataSource)

  const allChains = await chainService.getAllChains();
  const eventProcessor = new EventProcessor(allChains);
  await eventProcessor.update();

  const storage = eventProcessor.getStorage();
  const storageToInsert = formStorage(storage);

  const queryRunner: QueryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
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
    await queryRunner.manager.save(Chain, storageToInsert.chains, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(ChainActionProposal, storageToInsert.currentPeriodChainActionProposals, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(User, storageToInsert.users, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(Log, storageToInsert.logs, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(Asset, storageToInsert.assets, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(AssignOperator, storageToInsert.assignOperators, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(AttackSpecies, storageToInsert.attackSpecies, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(DefendSpecies, storageToInsert.defendSpecies, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(NFTType, storageToInsert.nfttypes, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.manager.save(Info, storageToInsert.info, { chunk: MAX_DB_WRITES_BATCH_SIZE });
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Transaction rolled back due to error:', error);
    throw new Error('Failed to process events');
  } finally {
    await queryRunner.release();
  }

  return storageToInsert.users.length + storageToInsert.assets.length + storageToInsert.currentPeriodChainActionProposals.length + storageToInsert.assignOperators.length + storageToInsert.logs.length;
}