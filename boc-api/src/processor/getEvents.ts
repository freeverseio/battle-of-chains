import {getJoinedChainEvents, getMultichainMintEvents, getAttackEvents, getChainActionProposalEvents, getUpgradeEvents, getAssignOperatorEvents, getTransferEvents} from './getEventsQueries';
import { sortEvents } from './sortEvents';
import {
    Chain,
    AllEventTypes,
} from './types';



export async function getAllEvents(chains: Chain[]): Promise<AllEventTypes[]> {
    const joinedChainEvents = await getJoinedChainEvents();
    const multichainMintEvents = await getMultichainMintEvents();
    const attackEvents = await getAttackEvents();
    const chainActionProposalEvents = await getChainActionProposalEvents();
    const upgradeEvents = await getUpgradeEvents();

    let allEvents: AllEventTypes[] = [
        ...joinedChainEvents,
        ...multichainMintEvents,
        ...attackEvents,
        ...chainActionProposalEvents,
        ...upgradeEvents
      ];
    
    for (let i = 0; i < chains.length; i++) {
        const assignOperatorEvents = await getAssignOperatorEvents(i, chains[i].chain_id);
        allEvents = [...allEvents, ...assignOperatorEvents];
        const transferEvents = await getTransferEvents(i, chains[i].chain_id);
        allEvents = [...allEvents, ...transferEvents];
    }

    return sortEvents(allEvents);
}