import { Storage, AssignOperatorEvent } from './types';
import { createDAO, userDoesNotExist } from './utils'

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
        storage.logs.push({
            id: storage.logs.length,
            user_address: event.from,
            timestamp: event.timestamp,
            comment: `Added new operator assignment to ${event.operator} on chain ${event.eventChain}`,
        });
        return;
    }

    if (event.from === event.operator) {
        storage.assignOperators = storage.assignOperators.filter(
            operator => !(operator.assigner === event.from && operator.chain_id === event.eventChain)
        );
        storage.logs.push({
            id: storage.logs.length,
            user_address: event.from,
            timestamp: event.timestamp,
            comment: `Removed the previous operator assignment to ${event.operator} on chain ${event.eventChain}`,
        });
        return;
    }

    existingAssignment.operator = event.operator;
    existingAssignment.timestamp = event.timestamp;
    storage.logs.push({
        id: storage.logs.length,
        user_address: event.from,
        timestamp: event.timestamp,
        comment: `Updated the previous operator assignment on chain ${event.eventChain}}, now assigned to ${event.operator}`,
    });
}
