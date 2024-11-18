import { send } from 'process';
import { AssetState, GameTreasurySendMethod, PendingActionOption, PendingAttack, PendingState, SendGameTreasuryEvent, Storage, TransferEvent } from './types';
import { chainName, createDAO, findUser, hasHomechain, log2user, setAssetsFree, userDoesNotExist } from './utils'

export function processSendGameTreasury(event: SendGameTreasuryEvent, storage: Storage): void {
    console.log(`Processing SendGameTreasuryEvent From: ${event.from}, Timestamp: ${event.timestamp}`);

    const sender = findUser(event.from, storage.users);
    if (!sender) {
        console.log('Non existing user tried to send treasury: ', event.from);
        return;
    }

    if (hasHomechain(sender)) {
        log2user(
            event.from,
            'You tried to send game treasury, but you are registered as a normal user. Only Mercenaries can send their treasury.',
            event.timestamp,
            storage.logs,
        );
        return;
    }

    const initialTreasury = sender.treasury;
    let remainingTreasury = initialTreasury;
    
    for (const sendTX of event.sendTXs) {
        const recipient = findUser(sendTX.recipient, storage.users);
        if (!recipient) {
            log2user(
                event.from,
                `You tried to send game treasury to a non-exisiting user with address ${sendTX.recipient}`,
                event.timestamp,
                storage.logs,
            );
            return;
        }

        const toTransfer = event.method == GameTreasurySendMethod.ABSOLUTE
            ? sendTX.amount
            : Math.floor(sendTX.amount * initialTreasury / 10000);

        if (remainingTreasury >= toTransfer) {
            sender.treasury -= toTransfer;
            recipient.treasury += toTransfer;
            remainingTreasury -= toTransfer;
        } else {
            log2user(
                event.from,
                `You tried to send ${toTransfer} from your game treasury to but you do not have enough`,
                event.timestamp,
                storage.logs,
            );
            return;          
        }
    }
    log2user(
        event.from,
        `You successfully sent ${initialTreasury - remainingTreasury} from your game treasury`,
        event.timestamp,
        storage.logs,
    );
}