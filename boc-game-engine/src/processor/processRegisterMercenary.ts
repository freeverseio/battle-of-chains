import { Storage, JoinedChainEvent, RegisterMercenaryEvent } from './types';
import { chainIsNotSupported, findUser, isCorrectOperator, userDoesNotExist } from './utils'
import * as constants from './constants';

export function processRegisterMercenary(event: RegisterMercenaryEvent, storage: Storage): void {
    console.log(`Processing RegisterMercenary Event ${event.timestamp}, ${event.mercenaryAddress}, Chain: ${event.mercenaryChain}, Timestamp: ${event.timestamp}`);

    if (chainIsNotSupported(event.mercenaryChain, storage.chains)) return;
    const existingUser = findUser(event.mercenaryAddress, storage.users);
    if (!existingUser) return;

    // TODO: remove this, and parse from the event
    const temporaryOperator = "0x0B6aA63f1A95BEA0F9a18Fd2e3888d4C7EC54574".toLowerCase();
    if (!isCorrectOperator(temporaryOperator, event.mercenaryAddress, storage.assignOperators)) {
        console.log(`WARNING: operator ${temporaryOperator} tried a non-authorized authorized registerMercenary on behalf of ${event.mercenaryAddress}`);
        return
    }

    if (existingUser.homechain) {
        console.log('WARNING: a mercenary cannot have joined a chain previously');
        return;
    }
    if (existingUser.mercenaryChain) {
        console.log('WARNING: a mercenary cannot register twice');
        return;
    }
    existingUser.mercenaryChain = event.mercenaryChain;
    existingUser.name = event.mercenaryNickname;
    existingUser.joined_timestamp = event.timestamp;
    existingUser.treasuryLastUpdate = event.timestamp;

    storage.logs.push({
        id: storage.logs.length,
        user_address: event.mercenaryAddress,
        timestamp: event.timestamp,
        comment: `You have registered as a Mercenary in chain ${event.mercenaryAddress}. You can now acquire assets, attack and upgrade. You cannot mint, but you can share your treasury.`,
    });
}