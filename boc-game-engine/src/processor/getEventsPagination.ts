import { getAssignOperatorEventsInBatch, getAttackEventsInBatch, getChainActionProposalEventsInBatch, getJoinedChainEventsInBatch, getMultichainMintEventsInBatch, getUpgradeEventsInBatch } from "./getEventsQueries";
import {  AllEventTypes } from "./types";
import * as dotenv from "dotenv";

dotenv.config({ path: '../docker/.env' });
const INDEXER_MAX_BATCH_PER_PAGE = process.env.INDEXER_MAX_BATCH_PER_PAGE ? Number(process.env.INDEXER_MAX_BATCH_PER_PAGE) : 100;


export async function getJoinedChainEvents(): Promise<AllEventTypes[]> {
  return fetchAllEventsInLAOS(getJoinedChainEventsInBatch);
}

export async function getMultichainMintEvents(): Promise<AllEventTypes[]> {
  return fetchAllEventsInLAOS(getMultichainMintEventsInBatch);
}

export async function getAttackEvents(): Promise<AllEventTypes[]> {
  return fetchAllEventsInLAOS(getAttackEventsInBatch);
}

export async function getChainActionProposalEvents(): Promise<AllEventTypes[]> {
  return fetchAllEventsInLAOS(getChainActionProposalEventsInBatch);
}

export async function getUpgradeEvents(): Promise<AllEventTypes[]> {
  return fetchAllEventsInLAOS(getUpgradeEventsInBatch);
}

export async function getAssignOperatorEvents(chainIdx: number, chain_id: number): Promise<AllEventTypes[]> {
  return fetchAllEventsInChain(chainIdx, chain_id, getAssignOperatorEventsInBatch);
}

async function fetchAllEventsInLAOS(
  fetchBatchFunction: (limit: number, offset: number) => Promise<AllEventTypes[]>
): Promise<AllEventTypes[]> {
  let offset = 0;
  let allEvents: AllEventTypes[] = [];
  let hasMore = true;

  while (hasMore) {
    const events = await fetchBatchFunction(INDEXER_MAX_BATCH_PER_PAGE, offset);
    allEvents = allEvents.concat(events);
    offset += INDEXER_MAX_BATCH_PER_PAGE;

    if (events.length < INDEXER_MAX_BATCH_PER_PAGE) {
      hasMore = false;
    }
  }
  return allEvents;
}

async function fetchAllEventsInChain(
  chainIdx: number,
  chain_id: number,
  fetchBatchFunction: (chainIdx: number, chain_id: number, limit: number, offset: number) => Promise<AllEventTypes[]>
): Promise<AllEventTypes[]> {
  let offset = 0;
  let allEvents: AllEventTypes[] = [];
  let hasMore = true;

  while (hasMore) {
    const events = await fetchBatchFunction(chainIdx, chain_id, INDEXER_MAX_BATCH_PER_PAGE, offset);
    allEvents = allEvents.concat(events);
    offset += INDEXER_MAX_BATCH_PER_PAGE;

    if (events.length < INDEXER_MAX_BATCH_PER_PAGE) {
      hasMore = false;
    }
  }
  return allEvents;
}
