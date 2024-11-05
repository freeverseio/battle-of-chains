import { RawSendGameTreasury, SendGameTreasury, SendTX } from '../../model';

export function mapToSendGameTreasury(raw: RawSendGameTreasury): SendGameTreasury {
  return new SendGameTreasury({
    id: raw.id,
    from: raw.from,
    method: raw.method,
    sendTXs: raw.sendTXs.map(tx => new SendTX({
        recipient: tx.recipient,
        amount: tx.amount,
      })),
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    blockHash: raw.blockHash,
    txHash: raw.txHash,
    logIndex: raw.logIndex,
  });
}

export function createSendGameTreasuryModels(rawSendGameTreasuries: RawSendGameTreasury[]): SendGameTreasury[] {
  return rawSendGameTreasuries.map(mapToSendGameTreasury);
}