import { Storage, PendingAttack, PendingActionOption, PendingChainAction } from './types';
import { getNextPendingActionBefore, updateLastProcessedEventAt } from './utils'
import { processPendingAttack } from './processPendingAttack';
import { processChainActions } from './processPendingChainAction';

export function processPendingActions(deadline: number, storage: Storage): void {
    let nProcessed = 0;
    let action = getNextPendingActionBefore(deadline, storage.pendingActions);
    while(action) {
        nProcessed += 1;
        updateLastProcessedEventAt(action.toBeExectutedAt, storage);
        if (action.type === PendingActionOption.ChainAction) {
            processChainActions(action as PendingChainAction, storage);
            action = getNextPendingActionBefore(deadline, storage.pendingActions);
        } 
        else if (action.type === PendingActionOption.Attack) {
            processPendingAttack(action as PendingAttack, storage);
            action = getNextPendingActionBefore(deadline, storage.pendingActions);
        }
    }
    if (nProcessed > 0) updateLastProcessedEventAt(deadline, storage);
}