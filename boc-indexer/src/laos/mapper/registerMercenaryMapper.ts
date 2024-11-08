import { RawRegisterMercenary, RegisterMercenary, RegisterMercenaryModels } from "../../model";
import { generateLaosEventUUID } from "../util";

export function mapRegisterMercenary(raw: RawRegisterMercenary): RegisterMercenaryModels {
  const registerMercenary = new RegisterMercenary({
    id: generateLaosEventUUID(raw.txHash, raw.logIndex),
    operator: raw._operator,
    mercenaryAddress: raw.mercenaryAddress,
    mercenaryChain: raw.mercenaryChain,
    mercenaryNickname: raw.mercenaryNickname,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });

  console.log('Mapped RegisterMercenary event:', registerMercenary);
  return { registerMercenary };
}

export function createRegisterMercenaryModels(rawRegisterMercenaries: RawRegisterMercenary[]): RegisterMercenaryModels[] {
  return rawRegisterMercenaries.map((raw) => mapRegisterMercenary(raw));
}