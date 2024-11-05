import { Context } from '../processor';
import * as ERC721UniversalContract from '../../abi/UniversalContract';
import { parseBaseURI } from '../util';
import { v4 as uuidv4 } from 'uuid';
import { RawTransfer, DetectedEvents, RawOwnershipContract, RawSendGameTreasury, RawAssignOperator } from '../../model';

export class EventDetectionService {
  private ctx: Context;
  private ownershipContractsToCheck: Set<string>;

  constructor(ctx: Context, ownershipContractsToCheck: Set<string>) {
    this.ctx = ctx;
    this.ownershipContractsToCheck = ownershipContractsToCheck;
  }

  public detectEvents(): DetectedEvents {
    const transfers: RawTransfer[] = [];
    const ownershipContractsToInsertInDb: RawOwnershipContract[] = [];
    const sendGameTreasuries: RawSendGameTreasury[] = [];
    const assignOperators: RawAssignOperator[] = [];
    for (const block of this.ctx.blocks) {
      for (const log of block.logs) {
        this.detectNewERC721Universal(log, ownershipContractsToInsertInDb);
        this.detectTransfer(log, transfers, block.header.timestamp, block.header.height, block.header.hash);
        this.detectSendGameTreasury(log, sendGameTreasuries, block.header.timestamp, block.header.height, block.header.hash);
        this.detectAssignOperator(log, assignOperators, block.header.timestamp, block.header.height, block.header.hash);
      }
    }
    
    return {
      transfers,
      ownershipContracts: ownershipContractsToInsertInDb,
      sendGameTreasuries,
      assignOperators
    };;
  }

  private detectNewERC721Universal(log: any, ownershipContractsToInsertInDb: RawOwnershipContract[]): void {
    if (log.topics[0] === ERC721UniversalContract.events.NewERC721Universal.topic) {
      const logDecoded = ERC721UniversalContract.events.NewERC721Universal.decode(log);
      console.log('New ERC721 Universal contract detected:', logDecoded.newContractAddress);
      this.ownershipContractsToCheck.add(logDecoded.newContractAddress.toLowerCase());
      const baseURITokens = parseBaseURI(logDecoded.baseURI);     
      if (baseURITokens === null) return // If the baseURI is not valid, skip the ERC721Universal contract
      const laosContractAddress = baseURITokens?.accountKey20 ? baseURITokens.accountKey20.toLowerCase() : null;
      ownershipContractsToInsertInDb.push({
        id: logDecoded.newContractAddress.toLowerCase(),
        laosContract: laosContractAddress,
      });
    }
  }

  private detectTransfer(log: any, transfers: RawTransfer[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (this.ownershipContractsToCheck.has(log.address.toLowerCase()) && log.topics[0] === ERC721UniversalContract.events.Transfer.topic) {
      const logDecoded = ERC721UniversalContract.events.Transfer.decode(log);
      console.log('Transfer detected:', logDecoded);
      const { from, to, tokenId } = logDecoded;
      transfers.push({
        id: uuidv4(),
        tokenId : tokenId.toString(),
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        txHash: log.transactionHash,
        blockHash: blockHash,
        logIndex: log.logIndex,
        ownershipContract: log.address.toLowerCase(),
      });
    }
  }

  private detectSendGameTreasury(log: any, sendGameTreasuries: RawSendGameTreasury[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === ERC721UniversalContract.events.SendGameTreasury.topic) {
      const logDecoded = ERC721UniversalContract.events.SendGameTreasury.decode(log);
      console.log('SendGameTreasury detected:', logDecoded);
      sendGameTreasuries.push({
        id: uuidv4(),
        from: logDecoded._from.toLowerCase(),
        method: logDecoded._method,
        sendTXs: logDecoded._sendTXs.map(tx => ({
          recipient: tx.recipient.toLowerCase(),
          amount: tx.amount.toString(),
        })),
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectAssignOperator(log: any, assignOperators: RawAssignOperator[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === ERC721UniversalContract.events.AssignOperator.topic) {
      const logDecoded = ERC721UniversalContract.events.AssignOperator.decode(log);
      console.log('AssignOperator detected:', logDecoded);
      const rawAssignOperator: RawAssignOperator = {
        id: uuidv4(),
        from: logDecoded._from.toLowerCase(),
        operator: logDecoded._operator.toLowerCase(),
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      };
      assignOperators.push(rawAssignOperator);
    }
  }

}
