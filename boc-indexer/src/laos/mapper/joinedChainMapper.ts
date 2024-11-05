import { RawJoinedChain, JoinedChain, JoinedChainModels } from "../../model";
import { generateLaosEventUUID } from "../util";

export function mapJoinedChain(raw: RawJoinedChain): JoinedChainModels {
  const joinedChain = new JoinedChain({
    id: generateLaosEventUUID(raw.txHash, raw.logIndex),
    user: raw._user,
    homeChain: raw._homeChain,
    nickname: raw._nickname,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });

  console.log('Mapped joined chain event:', joinedChain);
  return { joinedChain };
}

export function createJoinedChainModels(rawJoinedChains: RawJoinedChain[]): JoinedChainModels[] {
  return rawJoinedChains.map((raw) => mapJoinedChain(raw));
}