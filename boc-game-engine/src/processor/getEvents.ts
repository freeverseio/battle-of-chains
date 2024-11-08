import {getJoinedChainEvents, getMultichainMintEvents, getAttackEvents, getChainActionProposalEvents, getUpgradeEvents, getAssignOperatorEvents, getTransferEvents, getRegisterMercenaryEvents} from './getEventsQueries';
import { sortEvents } from './sortEvents';
import {
    ChainType,
    AllEventTypes,
} from './types';
import { promises as fs } from 'fs';



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
    }

    // fs.writeFile('./src/processor/test/events.json', JSON.stringify(await sortEvents(allEvents), null, 2));
    return sortEvents(allEvents);
}