import { getJoinedChainEventsInBatch, getMultichainMintEventsInBatch } from "./getEventsQueries";
import {  AllEventTypes } from "./types";
import * as dotenv from "dotenv";

dotenv.config({ path: '../docker/.env' });
const INDEXER_MAX_BATCH_PER_PAGE = process.env.INDEXER_MAX_BATCH_PER_PAGE ? Number(process.env.INDEXER_MAX_BATCH_PER_PAGE) : 100;


export async function getJoinedChainEvents(): Promise<AllEventTypes[]> {
  return fetchAllEvents(getJoinedChainEventsInBatch);
}

export async function getMultichainMintEvents(): Promise<AllEventTypes[]> {
  return fetchAllEvents(getMultichainMintEventsInBatch);
}

async function fetchAllEvents(
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
