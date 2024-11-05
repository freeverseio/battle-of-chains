import { getChains } from './getChains';
import {
    EventType,
    JoinedChainEvent, MultichainMintEvent, AttackEvent, ChainActionProposalEvent, UpgradeEvent,
    Storage,
    AssignOperatorEvent,
    TransferEvent,
    PendingChainAction,
    PendingActionOption,
} from './types';
import { getAllEvents } from './getEvents';
import { processJoinedChain } from './processJoinedChain';
import { processMultichainMint } from './processMultichainMint';
import { processAttack } from './processAttack';
import { processChainActionProposal } from './processChainActionProposal';
import { processUpgrade } from './processUpgrade';
import { ChainOutput } from '../services/chainService';
import { promises as fs } from 'fs';  // Import fs.promises
import { processAssignOperator } from './processAssignOperator';
import { processTransfer } from './processTransfer';
import { processPendingActions } from './processPendingActions';
import { evolveAllAssetsStats, rarityToRanges, updateAllChainProposalVotes, updateAllScores } from './utils';
import * as dotenv from "dotenv";
import { attackSpeciesStats } from './speciesAttack';
import { defendSpeciesStats } from './speciesDefend';
dotenv.config();
const DEBUG = process.env.DEBUG ? true : false;
const GAME_START_TIMESTAMP= process.env.GAME_START_TIMESTAMP ? Number(process.env.GAME_START_TIMESTAMP) : Number(1729168020);


export class EventProcessor {
    private storage: Storage;

    constructor(allChains: ChainOutput[]) {
        const initChainProposalAction : PendingChainAction = {  
            id: 0,
            type: PendingActionOption.ChainAction,
            toBeExectutedAt: getNext2pmUTC(GAME_START_TIMESTAMP),
        }

        this.storage = {
            chains: allChains,
            users: [],
            assets: [],
            assignOperators: [],
            logs: [],
            currentPeriodChainActionProposals: [],
            pendingActions: [initChainProposalAction],
            lastProcessedEventAt: 0,
            processedPendingIdx: 0,
            defendRanges: rarityToRanges(defendSpeciesStats.map(([, stats]) => stats.rarity)),
            attackRanges: rarityToRanges(attackSpeciesStats.map(([, stats]) => stats.rarity)),
        };
    }

    getStorage(): Storage {
        return this.storage;
    }

    exportStorage() {
        fs.writeFile('storage.json', JSON.stringify(this.storage, null, 2));
    }
    
    async update() {
        try {
            const allEvents = await getAllEvents(this.storage.chains);
            for (let event of allEvents) {
                processPendingActions(event.timestamp, this.storage);

                const nextEventTypeToProcess = event.eventType;
                if (nextEventTypeToProcess == EventType.JoinedChainEvent) {
                    processJoinedChain(event as JoinedChainEvent, this.storage);
                }
                else if (nextEventTypeToProcess == EventType.MultichainMintEvent) {
                    processMultichainMint(event as MultichainMintEvent, this.storage);
                }
                else if (nextEventTypeToProcess == EventType.AttackEvent) {
                    processAttack(event as AttackEvent, this.storage);
                }
                else if (nextEventTypeToProcess == EventType.ChainActionProposalEvent) {
                    processChainActionProposal(event as ChainActionProposalEvent, this.storage);
                }
                else if (nextEventTypeToProcess == EventType.UpgradeEvent) {
                    processUpgrade(event as UpgradeEvent, this.storage);
                }
                else if (nextEventTypeToProcess == EventType.AssignOperatorEvent) {
                    processAssignOperator(event as AssignOperatorEvent, this.storage);
                }
                else if (nextEventTypeToProcess == EventType.TransferEvent) {
                    processTransfer(event as TransferEvent, this.storage);
                }
                else {
                    throw new Error(`Event type not supported: ${nextEventTypeToProcess}`);
                }
            }
            const now = Math.floor(new Date().getTime()/1000);
            const evolveUntil = Math.max(now, this.storage.lastProcessedEventAt);

            if (evolveUntil > this.storage.lastProcessedEventAt) {
                processPendingActions(evolveUntil, this.storage);
            }

            evolveAllAssetsStats(evolveUntil, this.storage);
            updateAllScores(this.storage);
            updateAllChainProposalVotes(evolveUntil, this.storage);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }
}

export function getNext2pmUTC(referenceTimestamp: number): number {
    const reference = new Date(referenceTimestamp * 1000);
    
    // Create a new Date object for the dat of the reference time, at 2 PM UTC
    const next2pmUTC = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate(), 14, 0, 0, 0));

    // If 2 PM UTC today had already passed, set it to 2 PM UTC of the day after
    if (reference.getUTCHours() >= 14) {
        next2pmUTC.setUTCDate(next2pmUTC.getUTCDate() + 1);
    }

    // Return the timestamp (seconds since epoch)
    return Math.round(next2pmUTC.getTime() / 1000);
}

async function main() {
    if (!DEBUG) return;

    const allChains = await getChains();

    const eventProcessor = new EventProcessor(allChains);
    await eventProcessor.update();

    eventProcessor.exportStorage();
}

main();
