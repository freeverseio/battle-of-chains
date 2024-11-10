import { Storage, AssignOperatorEvent } from './types';
import { chainName, createDAO, log2user, userDoesNotExist } from './utils'

export function processAssignOperator(event: AssignOperatorEvent, storage: Storage): void {
    console.log(`Processing AssignOperator Event ${event.timestamp}, From: ${event.from}, Operator: ${event.operator}, Timestamp: ${event.timestamp}, on chain ${event.eventChain}`);

    if (userDoesNotExist(event.from, storage.users)) {
        createDAO(storage, event.from, event.eventChain, event.timestamp);
    }

    const existingAssignment = storage.assignOperators.find(operator => 
        operator.assigner === event.from && operator.chain_id === event.eventChain
    );

    if (!existingAssignment) {
        storage.assignOperators.push({
            assigner: event.from,
            operator: event.operator,
            chain_id: event.eventChain,
            timestamp: event.timestamp
        });
        log2user(
            event.from,
            `Added new operator assignment to ${event.operator} on ${chainName(event.eventChain, storage.chains)}`,
            event.timestamp,
            storage.logs,
        );
        return;
    }

    if (event.from === event.operator) {
        storage.assignOperators = storage.assignOperators.filter(
            operator => !(operator.assigner === event.from && operator.chain_id === event.eventChain)
        );
        log2user(
            event.from,
            `Removed the previous operator assignment to ${event.operator} on ${chainName(event.eventChain, storage.chains)}`,
            event.timestamp,
            storage.logs,
        );
        return;
    }

    existingAssignment.operator = event.operator;
    existingAssignment.timestamp = event.timestamp;
    log2user(
        event.from,
        `Updated the previous operator assignment, now assigned to ${event.operator}`,
        event.timestamp,
        storage.logs,
    );
}
