import { Storage, TransferEvent } from './types';
import { createDAO, userDoesNotExist } from './utils'

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
    if (asset) {
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
}
