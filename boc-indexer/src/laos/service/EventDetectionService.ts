import { Context } from '../processor';
import * as EvolutionCollection from '../../abi/EvolutionCollection'
import * as BattleOfChains from '../../abi/BattleOfChains';
import { 
    DetectedLaosEvents, 
    RawMintedWithExternalURI, 
    RawEvolvedWithExternalURI,
    RawAttack,
    RawChainActionProposal,
    RawJoinedChain,
    RawMultichainMint,
    RawUpgrade,
    RawRegisterMercenary 
} from '../../model';

export class EventDetectionService {
  private ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  public detectEvents(): DetectedLaosEvents {
    const mintEvents: RawMintedWithExternalURI[] = [];
    let evolveEvents: RawEvolvedWithExternalURI[] = [];
    let attackEvents: RawAttack[] = [];
    let chainActionProposalEvents: RawChainActionProposal[] = [];
    let joinedChainEvents: RawJoinedChain[] = [];
    let multichainMintEvents: RawMultichainMint[] = [];
    let upgradeEvents: RawUpgrade[] = [];
    let registerMercenaryEvents: RawRegisterMercenary[] = [];

    for (const block of this.ctx.blocks) {
      for (const log of block.logs) {
        this.detectMintedWithExternalURI(log, mintEvents, block.header.timestamp, block.header.height);
        this.detectEvolvedWithExternalURI(log, evolveEvents, block.header.timestamp, block.header.height);
        this.detectAttack(log, attackEvents, block.header.timestamp, block.header.height, block.header.hash);
        this.detectChainActionProposal(log, chainActionProposalEvents, block.header.timestamp, block.header.height, block.header.hash);
        this.detectJoinedChain(log, joinedChainEvents, block.header.timestamp, block.header.height, block.header.hash);
        this.detectMultichainMint(log, multichainMintEvents, block.header.timestamp, block.header.height, block.header.hash);
        this.detectUpgrade(log, upgradeEvents, block.header.timestamp, block.header.height, block.header.hash);
        this.detectRegisterMercenary(log, registerMercenaryEvents, block.header.timestamp, block.header.height, block.header.hash);
      }
    }
    return {
      mintEvents,
      evolveEvents,
      attackEvents,
      chainActionProposalEvents,
      joinedChainEvents,
      multichainMintEvents,
      upgradeEvents,
      registerMercenaryEvents
    };
  }

  private detectMintedWithExternalURI(log: any, mintedEvents: RawMintedWithExternalURI[], timestamp: number, blockNumber: number): void {
    if (log.topics[0] === EvolutionCollection.events.MintedWithExternalURI.topic) {
      const logDecoded = EvolutionCollection.events.MintedWithExternalURI.decode(log);
      console.log('MintedWithExternalURI detected:', logDecoded);
      const { _to, _slot, _tokenId, _tokenURI } = logDecoded;
      mintedEvents.push({
        id: log.id,
        contract: log.address.toLowerCase(),
        _to: _to.toLowerCase(),
        _slot: _slot.toString(),
        _tokenId: _tokenId.toString(),
        _tokenURI,
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectEvolvedWithExternalURI(log: any, evolvedEvents: RawEvolvedWithExternalURI[], timestamp: number, blockNumber: number): void {
    if (log.topics[0] === EvolutionCollection.events.EvolvedWithExternalURI.topic) {
      const logDecoded = EvolutionCollection.events.EvolvedWithExternalURI.decode(log);
      console.log('EvolvedWithExternalURI detected:', logDecoded);
      const { _tokenId, _tokenURI } = logDecoded;
      evolvedEvents.push({
        id: log.id,
        contract: log.address.toLowerCase(),
        _tokenId: _tokenId.toString(),
        _tokenURI,
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectAttack(log: any, attackEvents: RawAttack[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === BattleOfChains.events.Attack.topic) {
      const logDecoded = BattleOfChains.events.Attack.decode(log);
      console.log('Attack detected:', logDecoded);
      const { _tokenIds, _targetAddress, _operator, _attacker, _targetChain, _strategy } = logDecoded;
      attackEvents.push({
        _tokenIds: _tokenIds.map(id => id.toString()),
        _targetAddress: _targetAddress.toLowerCase(),
        _operator: _operator.toLowerCase(),
        _attacker: _attacker.toLowerCase(),
        _targetChain,
        _strategy,
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectChainActionProposal(log: any, chainActionProposalEvents: RawChainActionProposal[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === BattleOfChains.events.ChainActionProposal.topic) {
      const logDecoded = BattleOfChains.events.ChainActionProposal.decode(log);
      console.log('ChainActionProposal detected:', logDecoded);
      const { _operator, _user, _sourceChain, _action, _comment } = logDecoded;
      chainActionProposalEvents.push({
        _operator: _operator.toLowerCase(),
        _user: _user.toLowerCase(),
        _sourceChain,
        _action: {
          targetChain: _action.targetChain,
          actionType: _action.actionType,
          attackArea: _action.attackArea,
          attackAddress: _action.attackAddress.toLowerCase()
        },
        _comment,
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectJoinedChain(log: any, joinedChainEvents: RawJoinedChain[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === BattleOfChains.events.JoinedChain.topic) {
      const logDecoded = BattleOfChains.events.JoinedChain.decode(log);
      console.log('JoinedChain detected:', logDecoded);
      const { _user, _homeChain, _nickname } = logDecoded;
      joinedChainEvents.push({
        _user: _user.toLowerCase(),
        _homeChain,
        _nickname,
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectMultichainMint(log: any, multichainMintEvents: RawMultichainMint[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === BattleOfChains.events.MultichainMint.topic) {
      const logDecoded = BattleOfChains.events.MultichainMint.decode(log);
      console.log('MultichainMint detected:', logDecoded);
      const { _tokenId, _user, _type, _homeChain } = logDecoded;
      multichainMintEvents.push({
        _tokenId : _tokenId.toString(),
        _user: _user.toLowerCase(),
        _type: String(_type),
        _homeChain,
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectUpgrade(log: any, upgradeEvents: RawUpgrade[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === BattleOfChains.events.Upgrade.topic) {
      const logDecoded = BattleOfChains.events.Upgrade.decode(log);
      console.log('Upgrade detected:', logDecoded);
      const { _operator, _user, _chain, _tokenId } = logDecoded;
      upgradeEvents.push({
        _operator: _operator.toLowerCase(),
        _user: _user.toLowerCase(),
        _chain,
        _tokenId : _tokenId.toString(),
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

  private detectRegisterMercenary(log: any, registerMercenaryEvents: RawRegisterMercenary[], timestamp: number, blockNumber: number, blockHash: string): void {
    if (log.topics[0] === BattleOfChains.events.RegisterMercenary.topic) {
      const logDecoded = BattleOfChains.events.RegisterMercenary.decode(log);
      console.log('RegisterMercenary detected:', logDecoded);
      const { _operator, _mercenaryAddress, _mercenaryChain, _mercenaryNickname } = logDecoded;
      registerMercenaryEvents.push({
        id: log.id,
        _operator: _operator.toLowerCase(),
        mercenaryAddress: _mercenaryAddress.toLowerCase(),
        mercenaryChain: _mercenaryChain,
        mercenaryNickname: _mercenaryNickname,
        timestamp: new Date(timestamp),
        blockNumber: blockNumber,
        blockHash: blockHash,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      });
    }
  }

}