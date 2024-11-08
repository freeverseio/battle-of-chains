export type RawEvent = RawMintedWithExternalURI | RawEvolvedWithExternalURI

export interface RawMintedWithExternalURI {
  id: string
  contract: string
  _tokenId: string
  _slot: string
  _tokenURI: string
  _to: string
  timestamp: Date
  blockNumber: number
  txHash: string
  logIndex: number
}

export interface RawEvolvedWithExternalURI {
  id: string
  contract: string
  _tokenId: string
  _tokenURI: string
  timestamp: Date
  blockNumber: number
  txHash: string
  logIndex: number
}

export interface DetectedLaosEvents {
  mintEvents: RawMintedWithExternalURI[],
  evolveEvents: RawEvolvedWithExternalURI[],
  attackEvents: RawAttack[];
  chainActionProposalEvents: RawChainActionProposal[];
  joinedChainEvents: RawJoinedChain[];
  multichainMintEvents: RawMultichainMint[];
  upgradeEvents: RawUpgrade[];
  registerMercenaryEvents: RawRegisterMercenary[]
}

export interface MetadataAttribute {
  trait_type: string
  value: string
}

export interface RawMetadata {
  image: string
  attributes: MetadataAttribute[]
  name: string
  description: string
}

export interface RawAttack {
  _tokenIds: string[];
  _targetAddress: string;
  _operator: string;
  _attacker: string;
  _targetChain: number;
  _strategy: number;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  txHash: string;
  logIndex: number;
}

export enum ActionType {
  DEFEND,
  IMPROVE,
  ATTACK_AREA,
  ATTACK_ADDRESS
}

export enum AttackArea {
  NULL,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  ALL
}

export interface RawChainActionProposal {
  _operator: string;
  _user: string;
  _sourceChain: number;
  _action: {
    targetChain: number;
    actionType: ActionType;
    attackArea: AttackArea;
    attackAddress: string;
  };
  _comment: string;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  txHash: string;
  logIndex: number;
}

export interface RawJoinedChain {
  _user: string;
  _homeChain: number;
  _nickname: string;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  txHash: string;
  logIndex: number;
}

export interface RawMultichainMint {
  _tokenId: string;
  _user: string;
  _type: string;
  _homeChain: number;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  txHash: string;
  logIndex: number;
}

export interface RawUpgrade {
  _operator: string;
  _user: string;
  _chain: number;
  _tokenId: string;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  txHash: string;
  logIndex: number;
}

export interface RawRegisterMercenary {
  id: string;
  mercenaryAddress: string;
  mercenaryChain: number;
  mercenaryNickname: string;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  txHash: string;
  logIndex: number;
}
