import { RawMultichainMint, MultichainMint, MultichainMintModels } from "../../model";
import { generateLaosEventUUID } from "../util";

export function mapMultichainMint(raw: RawMultichainMint): MultichainMintModels {
  const multichainMint = new MultichainMint({
    id: generateLaosEventUUID(raw.txHash, raw.logIndex),
    tokenId: raw._tokenId,
    user: raw._user,
    typeId: String(raw._type),
    homeChain: raw._homeChain,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });

  console.log('Mapped multichain mint event:', multichainMint);
  return { multichainMint };
}

export function createMultichainMintModels(rawMints: RawMultichainMint[]): MultichainMintModels[] {
  return rawMints.map((raw) => mapMultichainMint(raw));
}