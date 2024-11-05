import { Storage, JoinedChainEvent } from './types';
import { chainIsNotSupported } from './utils'
import * as constants from './constants';

export function processJoinedChain(event: JoinedChainEvent, storage: Storage): void {
    console.log(`Processing JoinedChain Event ${event.timestamp}, ${event.user}, HomeChain: ${event.homeChain}, Timestamp: ${event.timestamp}`);

    if (chainIsNotSupported(event.homeChain, storage.chains)) return;

    // A user can exist in the DB because it acquired assets in a chain before joining.
    const existingUser = storage.users.find(u => u.address.toLowerCase() === event.user.toLowerCase());

    if (existingUser) {
        existingUser.homechain = event.homeChain;
        existingUser.name = event.nickname;
        existingUser.joined_timestamp = event.timestamp;
        existingUser.treasury += constants.TREASURY_INIT_ALLOCATION;
        existingUser.treasuryLastUpdate = event.timestamp;
    } else {
        storage.users.push({
            address: event.user,
            homechain: event.homeChain,
            name: event.nickname,
            joined_timestamp: event.timestamp,
            score: 0,
            treasury: constants.TREASURY_INIT_ALLOCATION,
            treasuryLastUpdate: event.timestamp,
            health: 100,
            xp: 0,
            level: 0
        });
    }

    storage.logs.push({
        id: storage.logs.length,
        user_address: event.user,
        timestamp: event.timestamp,
        comment: `You have joined the game, supporting the chain ${event.homeChain}. Go ahead and do your first multichain atomic mints.`,
    });
}