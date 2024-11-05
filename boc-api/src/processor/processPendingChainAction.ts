import { Storage, PendingChainAction, ChainActionProposalType, ChainActionProposalOption, actionAreaNames, actionTypeNames } from './types';
import { decreaseHealth, evolveAllAssetsStats, executeChainImprove, findAllAssetsInArea, findAllAssetsNearAddress, removeAllUserSupportedActions, selectMostVotedChainAction, shuffleArray, updateAllTreasuries } from './utils'
import { INTERVAL_BETWEEN_CHAIN_ACTIONS } from './constants';
import murmurhash from 'murmurhash';

export function processChainActions(action: PendingChainAction, storage: Storage) {
    let mostVotedActions: ChainActionProposalType[] = [];

    // Get the most voted actions per chain (do not execute them yet)
    for (let chain of storage.chains) {
        console.log(`Processing Chain Action for chain ${chain.chain_id}`);
        let mostVoted = selectMostVotedChainAction(chain.chain_id, action.toBeExectutedAt, storage);
        if (!mostVoted) {
            mostVoted = {hash: "0", sourceChain: chain.chain_id, votes: 0, actionType: 0};     
        }
        mostVotedActions.push(mostVoted as ChainActionProposalType);
    }

    // Shuffle them randomly, since order of execution may matter
    const seed = murmurhash(`${action.id}${storage.lastProcessedEventAt}`);
    shuffleArray(mostVotedActions, seed);

    // Bring all users and assets up to date
    evolveAllAssetsStats(action.toBeExectutedAt, storage);
    updateAllTreasuries(action.toBeExectutedAt, storage);

    // Execute
    for (const chainAction of mostVotedActions) {
        executeChainAction(chainAction, action.toBeExectutedAt, mostVotedActions, storage)
    }

    // Create a pending chain action event for the future and clean all current proposals and assignements
    action.toBeExectutedAt += INTERVAL_BETWEEN_CHAIN_ACTIONS;
    storage.processedPendingIdx += 1;
    removeAllUserSupportedActions(storage.users);
    storage.currentPeriodChainActionProposals = [];
}

function executeChainAction(action: ChainActionProposalType, timestamp: number, allActions: ChainActionProposalType[], storage: Storage) {
    if (action.hash === '0') {
        storage.logs.push({
            id: storage.logs.length,
            chain: action.sourceChain,
            timestamp: timestamp,
            comment: `Chain Action missed! Chain ${action.sourceChain} did not have any proposal in the current period`,
        });
        return;
    }
    if (action.actionType === ChainActionProposalOption.Defend) {
        storage.logs.push({
            id: storage.logs.length,
            chain: action.sourceChain,
            timestamp: timestamp,
            comment: `Chain Action selected! Chain ${action.sourceChain} decided to Defend`,
        });
        return;
    }
    if (action.actionType === ChainActionProposalOption.Improve) {
        storage.logs.push({
            id: storage.logs.length,
            chain: action.sourceChain,
            timestamp: timestamp,
            comment: `Chain Action selected! Chain ${action.sourceChain} decided to Improve. All assets in chain improved their XP and Health`,
        });
        executeChainImprove(action.sourceChain, storage);
        return;
    }

    let comment = `Attack Chain Action Selected! Chain ${action.sourceChain} decided to perform an ${actionTypeNames[action.actionType]} action.`;
    comment += ` The attack is on chain_id: ${action.targetChain}`;

    if (!action.targetChain) {
        console.log('WARNING: targetChain should have been defined!', action);
        return;
    }

    const targetChainAction = allActions.find((a) => a.sourceChain === action.targetChain);
    const isTargetChainDefending = targetChainAction?.actionType === ChainActionProposalOption.Defend;
    const damageHP = isTargetChainDefending ? 10 : 50;

    if (action.actionType == ChainActionProposalOption.AttackArea && action.attackArea) {
        comment += `, on the area: ${actionAreaNames[action.attackArea]}`;
        const assetsInArea = findAllAssetsInArea(action.targetChain, action.attackArea, storage.assets);
        decreaseHealth(damageHP, assetsInArea);
    }

    if (action.actionType == ChainActionProposalOption.AttackAddress) {
        comment += `, on the address: ${action.attackAddress}`;
        if (!action.attackAddress) {
            console.log('WARNING: attackAddress should have been defined!', action);
            return;
        }
        const assetsNearAddress = findAllAssetsNearAddress(action.targetChain, action.attackAddress, storage.assets);
        decreaseHealth(damageHP, assetsNearAddress);
    }
   
    comment += `. The target chain was ${!isTargetChainDefending ? 'NOT': ''} defending, and hence all assets in the area received ${damageHP} damage.`

    storage.logs.push({
        id: storage.logs.length,
        chain: action.sourceChain,
        timestamp: timestamp,
        comment: comment,
    });
}