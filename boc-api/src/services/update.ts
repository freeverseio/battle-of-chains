import { AppDataSource } from '../db/AppDataSource';
import { Chain, Log, User, Asset, ChainActionProposal, AssignOperator, AttackSpecies, DefendSpecies, NFTType, Info } from '../db/entity';
import { EventProcessor } from '../processor/process';
import { getAllChains } from './chainService';
import { formStorage } from './getDataToStore';
import { QueryRunner } from 'typeorm';

export async function update(context: any): Promise<number> {
  const allChains = await getAllChains();
  const eventProcessor = new EventProcessor(allChains);
  await eventProcessor.update();

  const storage = eventProcessor.getStorage();
  const storageToInsert = formStorage(storage);

  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  // Order is important here, since some tables refer to others. Respect the table creation order.
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
    await queryRunner.manager.save(Chain, storageToInsert.chains);
    await queryRunner.manager.save(ChainActionProposal, storageToInsert.currentPeriodChainActionProposals);
    await queryRunner.manager.save(User, storageToInsert.users);
    await queryRunner.manager.save(Log, storageToInsert.logs);
    await queryRunner.manager.save(Asset, storageToInsert.assets);
    await queryRunner.manager.save(AssignOperator, storageToInsert.assignOperators);
    await queryRunner.manager.save(AttackSpecies, storageToInsert.attackSpecies);
    await queryRunner.manager.save(DefendSpecies, storageToInsert.defendSpecies);
    await queryRunner.manager.save(NFTType, storageToInsert.nfttypes);
    await queryRunner.manager.save(Info, storageToInsert.info);
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