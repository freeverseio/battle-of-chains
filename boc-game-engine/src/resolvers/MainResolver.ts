import { update } from '../services/update';
import { ChainService, ProcessStatusEnum, ProcessStatusOutput } from '../services/chainService';
import dbConfig from '../db/config/DatabaseConfig';
import { createAppDataSource } from '../db/AppDataSource';
import { DbKey } from '../db/config/DbKey';

const MAX_PROCESSING_STALE_TIME = parseInt(process.env.MAX_PROCESSING_STALE_TIME || "300", 10);

function isReadyToProcess(st: ProcessStatusOutput): boolean {
  if (st.status !== ProcessStatusEnum.FREE) {
    return false;
  }
  const minSecsFromLastUpdate = 5;
  const waitedEnough = (Date.now() - new Date(st.last_update).getTime()) / 1000 > minSecsFromLastUpdate;
  return waitedEnough;
}

async function cleanStaleProcessingStatus(chainService: ChainService, dbName: string): Promise<void> {
  const status = await chainService.getStatus();
  const lastUpdateTime = new Date(status[0].last_update).getTime();
  const timeElapsedSinceLastUpdateInSeconds = (Date.now() - lastUpdateTime) / 1000;
  
  const isProcessing = status[0].status === ProcessStatusEnum.PROCESSING;
  const hasExceededStaleTime = timeElapsedSinceLastUpdateInSeconds > MAX_PROCESSING_STALE_TIME;
  
  const processingStale = isProcessing && hasExceededStaleTime;
  if (processingStale) {
    console.warn(`Detected stale PROCESSING status for ${dbName}. Resetting to FREE.`);
    await chainService.setStatus(ProcessStatusEnum.FREE);
  }
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

      await cleanStaleProcessingStatus(chainServiceReadDb, currentReadDbName);
      await cleanStaleProcessingStatus(chainServiceWriteDb, currentWriteDbName);

      const status = await chainServiceReadDb.getStatus();
      if (!isReadyToProcess(status[0])) {
        console.log("Not ready to process yet!");
        return 0;
      }

      let nProcessedEvents = 0;
      let reprocessingError: Error | null = null;

      try {
        await chainServiceWriteDb.setStatus(ProcessStatusEnum.PROCESSING);
        nProcessedEvents = await update(currentWriteDbDataSource);
        dbConfig.switchCurrentReadDB();
        dbConfig.switchCurrentWriteDB();
      } catch (error) {
        console.error("Error during reprocessing:", error);
        reprocessingError = new Error("Reprocessing failed. Please try again later.");
      } finally {
        try {
          await chainServiceReadDb.setStatus(ProcessStatusEnum.FREE);
          await chainServiceWriteDb.setStatus(ProcessStatusEnum.FREE);
        } catch (error) {
          console.error("Error finalizing update:", error);
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
