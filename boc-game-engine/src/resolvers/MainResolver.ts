import { update } from '../services/update';
import { getStatus, setStatus, ProcessStatusEnum, ProcessStatusOutput } from '../services/chainService';  // Assuming you have a service to get chains
import { switchDB } from '../db/AppDataSource';

function isReadyToProcess(st: ProcessStatusOutput): boolean {
  if (st.status !== ProcessStatusEnum.FREE) {
    return false;
  }
  const minSecsFromLastUpdate = 5;
  const waitedEnough = (Date.now() - new Date(st.last_update).getTime()) / 1000 > minSecsFromLastUpdate;
  console.log('Trying to update too quickly');
  return waitedEnough;
}

export const localResolvers = {
  Mutation: {
    async update(): Promise<number> {
      const s = await getStatus();
      if (!isReadyToProcess(s[0])) return 0;

      let nProcessedEvents = 0;
      try {
        await setStatus(ProcessStatusEnum.PROCESSING);
        nProcessedEvents = await update();
      } catch (error) {
        console.error("Error during reprocessing:", error);
        throw new Error("Reprocessing failed. Please try again later.");
      } finally {
        await setStatus(ProcessStatusEnum.FREE);
      }
      return nProcessedEvents;
    },

    async switch(): Promise<boolean> { // Move `switch` into `Mutation`
      switchDB();
      return true;
    },
  },
};

export const localTypeDefs = `
    type Mutation {
      update: Int
      switch: Boolean
    }
  `;
