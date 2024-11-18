import { AssetState, PendingActionOption, PendingAttack, PendingState, SendGameTreasuryEvent, Storage, TransferEvent } from './types';
import { chainName, createDAO, log2user, setAssetsFree, userDoesNotExist } from './utils'

export function processSendGameTreasury(event: SendGameTreasuryEvent, storage: Storage): void {
    console.log(`Processing SendGameTreasuryEvent From: ${event.from}, Timestamp: ${event.timestamp}`);

    console.log(`WARNING: processSendGameTreasury NOT IMPLEMENTED YET`);

}