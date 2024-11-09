import { AssetState, PendingActionOption, PendingAttack, PendingState, Storage, TransferEvent } from './types';
import { chainName, createDAO, log2user, setAssetsFree, userDoesNotExist } from './utils'

export function processTransfer(event: TransferEvent, storage: Storage): void {
    console.log(`Processing Transfer Event ${event.tokenId}, From: ${event.from}, Operator: ${event.to}, Timestamp: ${event.timestamp}`);

    if (event.from === event.to) return;

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
    log2user(
        event.to,
        `You acquired asset with tokenId ${event.tokenId} on ${chainName(event.eventChain, storage.chains)}`,
        event.timestamp,
        storage.logs,
    );
    log2user(
        event.from,
        `You sold the asset your previously owned with tokenId ${event.tokenId} on chain ${chainName(event.eventChain, storage.chains)}`,
        event.timestamp,
        storage.logs,
    );
}
