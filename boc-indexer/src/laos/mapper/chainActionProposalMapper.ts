import { RawChainActionProposal, ChainActionProposal, ChainActionProposalModels } from "../../model";
import { generateLaosEventUUID } from "../util";

export function mapChainActionProposal(raw: RawChainActionProposal): ChainActionProposalModels {
  const chainActionProposal = new ChainActionProposal({
    id: generateLaosEventUUID(raw.txHash, raw.logIndex),
    operator: raw._operator,
    user: raw._user,
    sourceChain: raw._sourceChain,
    targetChain: raw._action.targetChain,
    actionType: raw._action.actionType,
    attackArea: raw._action.attackArea,
    attackAddress: raw._action.attackAddress,
    comment: raw._comment,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });

  console.log('Mapped chain action proposal event:', chainActionProposal);
  return { chainActionProposal };
}

export function createChainActionProposalModels(rawProposals: RawChainActionProposal[]): ChainActionProposalModels[] {
  return rawProposals.map((raw) => mapChainActionProposal(raw));
}