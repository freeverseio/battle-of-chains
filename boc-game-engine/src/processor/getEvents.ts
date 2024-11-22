import { getJoinedChainEvents, getMultichainMintEvents, getAttackEvents, getChainActionProposalEvents, getUpgradeEvents, getAssignOperatorEvents, getTransferEvents, getRegisterMercenaryEvents, getSendGameTreasuryEvents } from './getEventsPagination';
import { sortEvents } from './sortEvents';
import {
    ChainType,
    AllEventTypes,
} from './types';

export async function getAllEvents(chains: ChainType[]): Promise<AllEventTypes[]> {
    const joinedChainEvents = await getJoinedChainEvents();
    const multichainMintEvents = await getMultichainMintEvents();
    const attackEvents = await getAttackEvents();
    const chainActionProposalEvents = await getChainActionProposalEvents();
    const upgradeEvents = await getUpgradeEvents();
    const registerMercenaryEvents = await getRegisterMercenaryEvents();

    let allEvents: AllEventTypes[] = [
        ...joinedChainEvents,
        ...multichainMintEvents,
        ...attackEvents,
        ...chainActionProposalEvents,
        ...upgradeEvents,
        ...registerMercenaryEvents
      ];
    
    for (let i = 0; i < chains.length; i++) {
        const assignOperatorEvents = await getAssignOperatorEvents(i, chains[i].chain_id);
        allEvents = [...allEvents, ...assignOperatorEvents];
        const transferEvents = await getTransferEvents(i, chains[i].chain_id);
        allEvents = [...allEvents, ...transferEvents];
        const sendGameTreasuryEvents = await getSendGameTreasuryEvents(i, chains[i].chain_id);
        allEvents = [...allEvents, ...sendGameTreasuryEvents];
    }

    // Uncomment the following two lines when you need to update the tests only:
    // import { promises as fs } from 'fs';
    // fs.writeFile('./src/processor/test/events.json', JSON.stringify(await sortEvents(allEvents), null, 2));
    return sortEvents(allEvents);
}