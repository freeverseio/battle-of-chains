import { createHash } from 'crypto';
import { Storage, ChainActionProposalEvent, ChainActionProposalOption, actionAreaNames, actionTypeNames } from './types';
import { assignUserToChainProposal, chainIsNotSupported, findUser, isCorrectOperator, userDoesNotExist } from './utils'

export function processChainActionProposal(event: ChainActionProposalEvent, storage: Storage): void {
    console.log(`Processing ChainType Proposal Event ${event.timestamp}, ${event.user}, Timestamp: ${event.timestamp}`);

    if (chainIsNotSupported(event.targetChain, storage.chains)) return;

    if (!isCorrectOperator(event.operator, event.user, storage.assignOperators)) {
        console.log(`WARNING: operator ${event.operator} tried a non-authorized authorized chain proposal on behalf of ${event.user}`);
        return
    }

    const user = findUser(event.user, storage.users);

    if (!user) {
        console.log(`WARNING: chain proposal was made for a user that does not exist ${event.user}`);
        return
    }

    if (!user.homechain || user.homechain !== event.sourceChain) {
        console.log(`WARNING: chain proposal was made for a user that lives in a different chain:`, user.homechain);
        return
    }

    const proposalHash = generateProposalHash(event);
    const existingProposal = storage.currentPeriodChainActionProposals.find(u => u.hash === proposalHash);

    if (!existingProposal) {
        storage.currentPeriodChainActionProposals.push({
            hash: proposalHash,
            sourceChain: event.sourceChain,
            targetChain: event.targetChain !== 0 ? event.targetChain : undefined,
            actionType: event.actionType,
            attackArea: event.attackArea !== 0 ? event.attackArea : undefined,
            attackAddress: event.attackAddress.length > 0 ? event.attackAddress : undefined,
            votes: 0
        });
    }
    assignUserToChainProposal(event.user, proposalHash, storage.users, storage.currentPeriodChainActionProposals);

    let comment = `You are now supporting that chain ${event.sourceChain} performs an ${actionTypeNames[event.actionType]} action.`;
    if (event.actionType == ChainActionProposalOption.AttackArea) {
        comment += ` The attack is to be done on chain_id: ${event.targetChain}`;
        comment += `, on the area: ${actionAreaNames[event.attackArea]}`;
    }
    if (event.actionType == ChainActionProposalOption.AttackAddress) {
        comment += ` The attack is to be done on chain_id: ${event.targetChain}`;
        comment += `, on the address: ${event.attackAddress}`;
    }

    storage.logs.push({
        id: storage.logs.length,
        chain: event.sourceChain,
        timestamp: event.timestamp,
        comment: comment,
    });
}


function generateProposalHash(event: ChainActionProposalEvent): string {
    const proposalSerialized = `${event.sourceChain}|${event.targetChain}|${event.actionType}|${event.attackArea}|${event.attackAddress}`;
    return createHash('sha256').update(proposalSerialized).digest('hex');
}
