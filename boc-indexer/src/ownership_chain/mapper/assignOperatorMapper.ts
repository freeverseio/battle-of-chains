import { RawAssignOperator, AssignOperator } from '../../model';

export function mapToAssignOperator(raw: RawAssignOperator): AssignOperator {
  const result = new AssignOperator({
    id: raw.id,
    from: raw.from,
    operator: raw.operator,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });
  return result;
}

export function createAssignOperatorModels(rawAssignOperators: RawAssignOperator[]): AssignOperator[] {
  return rawAssignOperators.map(mapToAssignOperator);
}