import { AllEventTypes } from "./types";

export async function sortEvents(events: AllEventTypes[]): Promise<AllEventTypes[]> {
  return events.sort((a, b) => {
    // First, compare by timestamp
    if (a.timestamp !== b.timestamp) {
      return a.timestamp - b.timestamp;
    }
    // Then, compare by eventChain
    if (a.eventChain !== b.eventChain) {
      return a.eventChain - b.eventChain;
    }
    // Then, compare by blockNumber
    if (a.blockNumber !== b.blockNumber) {
      return a.blockNumber - b.blockNumber;
    }
    // Finally, compare by logIndex
    return a.logIndex - b.logIndex;
  });
}
