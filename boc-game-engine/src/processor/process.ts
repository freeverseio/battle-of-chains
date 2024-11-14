import {
    EventType,
    JoinedChainEvent, MultichainMintEvent, AttackEvent, ChainActionProposalEvent, UpgradeEvent,
    Storage,
    AssignOperatorEvent,
    TransferEvent,
    PendingChainAction,
    PendingActionOption,
    RegisterMercenaryEvent,
} from './types';
import { getAllEvents } from './getEvents';
import { processJoinedChain } from './processJoinedChain';
import { processMultichainMint } from './processMultichainMint';
import { processAttack } from './processAttack';
import { processChainActionProposal } from './processChainActionProposal';
import { processUpgrade } from './processUpgrade';
import { ChainOutput } from '../services/chainService';
import { promises as fs } from 'fs';
import { processAssignOperator } from './processAssignOperator';
import { processTransfer } from './processTransfer';
import { processPendingActions } from './processPendingActions';
import { evolveAllAssetsStats, getNext2pmUTC, rarityToRanges, updateAllChainProposalVotes, updateAllScores } from './utils';
import * as dotenv from "dotenv";
import { attackSpeciesStats } from './speciesAttack';
import { defendSpeciesStats } from './speciesDefend';
import { processRegisterMercenary } from './processRegisterMercenary';
dotenv.config({ path: '../docker/.env' });

type DebugData = {
    deadline: number;
    useHardcodedEvents: boolean;
    eventsFile: string;
    gameStartTime: number;
} 

function getGameStart(debugData: DebugData | undefined) {
    if (debugData?.gameStartTime) return debugData.gameStartTime;
    return process.env.GAME_START_TIMESTAMP ? Number(process.env.GAME_START_TIMESTAMP) : Number(1731073872);
}

export class EventProcessor {
    private storage: Storage;
    private debugData?: DebugData;

    constructor(allChains: ChainOutput[], debugData?: DebugData) {
        this.debugData = debugData;

        const initChainProposalAction : PendingChainAction = {  
            id: 0,
            type: PendingActionOption.ChainAction,
            toBeExectutedAt: getNext2pmUTC(getGameStart(debugData)),
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

    async update() {
        try {
            const allEvents = this.debugData?.useHardcodedEvents
                ? JSON.parse(await fs.readFile(this.debugData.eventsFile, 'utf-8'))
                : await getAllEvents(this.storage.chains);

            for (let event of allEvents) {
                if (this.debugData?.deadline && event.timestamp > this.debugData.deadline) {
                    console.log('returning...', event.timestamp)
                    continue;
                }

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
                else if (nextEventTypeToProcess == EventType.RegisterMercenaryEvent) {
                    processRegisterMercenary(event as RegisterMercenaryEvent, this.storage);
                }
                else {
                    throw new Error(`Event type not supported: ${nextEventTypeToProcess}`);
                }
            }
            const now = this.debugData?.deadline
                ? this.debugData.deadline
                : Math.floor(new Date().getTime()/1000);
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
