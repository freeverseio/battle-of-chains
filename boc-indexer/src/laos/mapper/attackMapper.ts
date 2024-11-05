import { RawAttack, Attack, AttackModels } from "../../model";
import { generateLaosEventUUID } from "../util";

export function mapAttack(raw: RawAttack): AttackModels {
  const attack = new Attack({
    id: generateLaosEventUUID(raw.txHash, raw.logIndex),
    tokenIds: raw._tokenIds.map(tokenId => tokenId.toString()),
    targetAddress: raw._targetAddress,
    operator: raw._operator,
    attacker: raw._attacker,
    targetChain: raw._targetChain,
    strategy: raw._strategy,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });
  
  console.log('Mapped attack event:', attack);
  return { attack };
}

export function createAttackModels(rawAttacks: RawAttack[]): AttackModels[] {
  return rawAttacks.map((raw) => mapAttack(raw));
}
