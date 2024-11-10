import { Storage, PendingChainAction, ChainActionProposalType, ChainActionProposalOption, actionAreaNames, actionTypeNames, AttackArea } from './types';
import { chainIsNotSupported, chainName, decreaseAssetHealthByPercent, evolveAllAssetsStats, executeChainImprove, findAllAssetsInArea, findAllAssetsNearAddress, getAliveInventoryInChain, log2chain, removeAllUserSupportedActions, selectMostVotedChainAction, shuffleArray, updateAllTreasuries } from './utils'
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

function wasActionMissed(action: ChainActionProposalType | undefined) : boolean {
    return !action || (action.hash === '0');
}

function executeChainAction(action: ChainActionProposalType, timestamp: number, allActions: ChainActionProposalType[], storage: Storage) {
    if (wasActionMissed(action)) {
        log2chain(
            action.sourceChain,
            `Chain Action missed! ${chainName(action.sourceChain, storage.chains)} did not have any proposal in the current period`,
            timestamp,
            storage.logs,
        );
        return;
    }
    if (action.actionType === ChainActionProposalOption.Defend) {
        log2chain(
            action.sourceChain,
            `Chain Action selected! ${chainName(action.sourceChain, storage.chains)} decided to Defend`,
            timestamp,
            storage.logs,
        );
        return;
    }
    if (action.actionType === ChainActionProposalOption.Improve) {
        log2chain(
            action.sourceChain,
            `Chain Action selected! ${chainName(action.sourceChain, storage.chains)} decided to Improve. All assets in chain improved their XP and Health`,
            timestamp,
            storage.logs,
        );
        executeChainImprove(action.sourceChain, storage);
        return;
    }

    let comment = `Attack Chain Action Selected! ${chainName(action.sourceChain, storage.chains)} decided to perform an ${actionTypeNames[action.actionType]} action.`;
    comment += ` The attack is on ${chainName(action.targetChain, storage.chains)}`;

    if (!action.targetChain || chainIsNotSupported(action.targetChain, storage.chains)) {
        console.log('WARNING: targetChain should have been defined or supported!', action);
        return;
    }

    const targetChainAction = allActions.find((a) => a.sourceChain === action.targetChain);
    const isTargetChainDefending = !wasActionMissed(targetChainAction) && targetChainAction?.actionType === ChainActionProposalOption.Defend;


    if (action.actionType == ChainActionProposalOption.AttackArea && action.attackArea) {
        comment += `, on the area: ${actionAreaNames[action.attackArea]}`;
        let damageHPPercent = action.attackArea === AttackArea.All ? 8 : 40;
        if (isTargetChainDefending) damageHPPercent /= 8;
        const assetsInArea = findAllAssetsInArea(action.targetChain, action.attackArea, storage.assets);
        for (let asset of assetsInArea) {
            decreaseAssetHealthByPercent(asset, damageHPPercent);
        }
    }
    else if (action.actionType == ChainActionProposalOption.AttackAddress) {
        comment += `, on the address: ${action.attackAddress}`;
        let damageHPPercent = 64;
        if (isTargetChainDefending) damageHPPercent /= 8;
        if (!action.attackAddress) {
            console.log('WARNING: attackAddress should have been defined!', action);
            return;
        }
        const assetsOfTargetUser = getAliveInventoryInChain(action.attackAddress, action.targetChain, storage.assets);
        for (let asset of assetsOfTargetUser) {
            decreaseAssetHealthByPercent(asset, damageHPPercent);
        }
    }
   
    comment += `. The target chain was ${!isTargetChainDefending ? 'NOT ': ''}defending, which resulted into ${isTargetChainDefending ? 'reduced': 'increased'} damage.`
    log2chain(action.sourceChain, comment, timestamp, storage.logs);
}