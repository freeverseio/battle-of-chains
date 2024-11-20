import { update } from '../services/update';
import { ChainService, ProcessStatusEnum, ProcessStatusOutput } from '../services/chainService';
import dbConfig from '../db/config/DatabaseConfig';
import { createAppDataSource } from '../db/AppDataSource';
import { DbKey } from '../db/config/DbKey';

function isReadyToProcess(st: ProcessStatusOutput): boolean {
  if (st.status !== ProcessStatusEnum.FREE) {
    return false;
  }
  const minSecsFromLastUpdate = 5;
  const waitedEnough = (Date.now() - new Date(st.last_update).getTime()) / 1000 > minSecsFromLastUpdate;
  return waitedEnough;
}

export const localResolvers = {
  Mutation: {
    async update(): Promise<number> {
      const currentReadDbName = dbConfig.getCurrentReadDb().name;
      const currentReadDbDataSource = await createAppDataSource(currentReadDbName as DbKey);
      const currentWriteDbName = dbConfig.getCurrentWriteDb().name;
      const currentWriteDbDataSource = await createAppDataSource(currentWriteDbName as DbKey);

      const chainServiceReadDb = new ChainService(currentReadDbDataSource);
      const chainServiceWriteDb = new ChainService(currentWriteDbDataSource);

      const s = await chainServiceReadDb.getStatus();
      if (!isReadyToProcess(s[0])) return 0;

      let nProcessedEvents = 0;
      let reprocessingError: Error | null = null;

      try {
        await chainServiceReadDb.setStatus(ProcessStatusEnum.PROCESSING);
        await chainServiceWriteDb.setStatus(ProcessStatusEnum.PROCESSING);
        nProcessedEvents = await update(currentWriteDbDataSource);
      } catch (error) {
        console.error("Error during reprocessing:", error);
        reprocessingError = new Error("Reprocessing failed. Please try again later.");
      } finally {
        try {
          await chainServiceReadDb.setStatus(ProcessStatusEnum.FREE);
          await chainServiceWriteDb.setStatus(ProcessStatusEnum.FREE);
          dbConfig.switchCurrentReadDB();
          dbConfig.switchCurrentWriteDB();
        } catch (error) {
          console.log("Error finalizing update:", error);
          if (!reprocessingError) {
            reprocessingError = new Error("Error finalizing update. Please try again later.");
          }
        }
      }

      if (reprocessingError) {
        throw reprocessingError;
      }

      return nProcessedEvents;
    },
  },
};

export const localTypeDefs = `
    type Mutation {
      update: Int
    }
  `;
