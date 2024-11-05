import { RawUpgrade, Upgrade, UpgradeModels } from "../../model";
import { generateLaosEventUUID } from "../util";

export function mapUpgrade(raw: RawUpgrade): UpgradeModels {
  const upgrade = new Upgrade({
    id: generateLaosEventUUID(raw.txHash, raw.logIndex),
    operator: raw._operator,
    user: raw._user,
    chain: raw._chain,
    tokenId: raw._tokenId,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });

  console.log('Mapped upgrade event:', upgrade);
  return { upgrade };
}

export function createUpgradeModels(rawUpgrades: RawUpgrade[]): UpgradeModels[] {
  return rawUpgrades.map((raw) => mapUpgrade(raw));
}