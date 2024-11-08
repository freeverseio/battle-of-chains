import { AssetState, PendingActionOption, PendingAttack, PendingState, Storage, TransferEvent } from './types';
import { createDAO, setAssetsFree, userDoesNotExist } from './utils'

export function processTransfer(event: TransferEvent, storage: Storage): void {
    console.log(`Processing Transfer Event ${event.tokenId}, From: ${event.from}, Operator: ${event.to}, Timestamp: ${event.timestamp}`);

    if (userDoesNotExist(event.from, storage.users)) {
        createDAO(storage, event.from, event.eventChain, event.timestamp);
        console.log(`WARNING: someone not in the game yet sold an asset: user = ${event.from}, tokenId = ${event.tokenId}, chain = ${event.eventChain}`);
    }

    if (userDoesNotExist(event.to, storage.users)) {
        createDAO(storage, event.to, event.eventChain, event.timestamp);
    }

    const asset = storage.assets.find(u => u.token_id === event.tokenId && u.chain_id === event.eventChain);
    if (!asset) {
        console.log(`WARNING: someone traded an asset not present in the game: from ${event.from}, tokenId = ${event.tokenId}, chain = ${event.eventChain}`);
        return;
    }

    if (asset.state !== AssetState.Free && asset.pendingAttackId) {
        const attack = storage.pendingActions[asset.pendingAttackId];
        if (attack.type === PendingActionOption.Attack && (attack as PendingAttack).currentState === PendingState.Departing) {
            setAssetsFree([asset]);
        }
    }

    asset.owner = event.to;
    storage.logs.push({
        id: storage.logs.length,
        user_address: event.to,
        timestamp: event.timestamp,
        comment: `You acquired asset with tokenId ${event.tokenId} on chain ${event.eventChain}`,
    });
    storage.logs.push({
        id: storage.logs.length,
        user_address: event.from,
        timestamp: event.timestamp,
        comment: `You sold the asset your previously owned with tokenId ${event.tokenId} on chain ${event.eventChain}`,
    });
}
