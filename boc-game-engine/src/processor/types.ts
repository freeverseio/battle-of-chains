import { FactorySpecies } from "./species";
import { AttackSpeciesType } from "./speciesAttack";
import { DefendSpeciesType } from "./speciesDefend";

export const actionTypeNames = ["Defend", "Improve", "AttackArea", "AttackAddress"];
export const actionAreaNames = ["NULL", "NORTH", "SOUTH", "EAST", "WEST", "ALL"];
export const nftTypeNames = ["Attack Asset", "Defense Asset", "Attack Factory", "Defense Factory"];

export enum AttackArea {
  Null,
  North,
  South,
  East,
  West,
  All,
}

export enum EventType {
  JoinedChainEvent,
  MultichainMintEvent,
  AttackEvent,
  ChainActionProposalEvent,
  UpgradeEvent,
  AssignOperatorEvent,
  TransferEvent,
  RegisterMercenaryEvent,
}

export enum AssetState {
  Free,
  Attaking,
}


export enum AssetTypeOptions {
  AttackAsset = "0",
  DefenseAsset = "1",
  AttackFactory = "2",
  DefenseFactory = "3",
}

export type AllEventTypes = 
  | JoinedChainEvent 
  | MultichainMintEvent 
  | AttackEvent 
  | ChainActionProposalEvent 
  | UpgradeEvent
  | AssignOperatorEvent
  | TransferEvent
  | RegisterMercenaryEvent;

export enum PendingState {
  Departing,
  Travelling,
}

export enum PendingActionOption {
  Attack,
  ChainAction,
}

export type PendingAction = PendingChainAction | PendingAttack;

type PendingActionBase = {
  id: number;
  type: PendingActionOption;
  toBeExectutedAt: number;
}

export type PendingChainAction = PendingActionBase & {} 

export type PendingAttack = PendingActionBase & {
  currentState: PendingState ;
  targetAddress: string;
  attacker: string;
  targetChain: number;
  strategy: number;
  blockHash: string;
} 


export enum ChainActionProposalOption {
  Defend,
  Improve,
  AttackArea,
  AttackAddress
}

export type XY = {
  x: bigint;
  y: bigint;
}

export type XYmeter = {
  x: number;
  y: number;
}


export type ChainType = {
  chain_id: number;
  name: string;
  score: number;
};

export type EventWithBlockInfo = {
  blockNumber: number;
  logIndex: number;
  timestamp: number;
  eventChain: number;
  eventType: EventType;
};

export type JoinedChainEvent = EventWithBlockInfo & {
    user: string;
    homeChain: number;
    nickname: string;
};

export type MultichainMintEvent = EventWithBlockInfo & {
    tokenId: bigint;
    user: string;
    typeId: AssetTypeOptions;
    homeChain: number;
    blockHash: string;
};

export type AttackEvent = EventWithBlockInfo & {
  tokenIds: string[];
  targetAddress: string;
  operator: string;
  attacker: string;
  targetChain: number;
  strategy: number;
  blockHash: string;
}

export type ChainActionProposalEvent = EventWithBlockInfo & {
  operator: string;
  user: string;
  sourceChain: number;
  targetChain: number;
  actionType: ChainActionProposalOption;
  attackArea: number;
  attackAddress: string;
  comment: string;
}

export type UpgradeEvent = EventWithBlockInfo & {
  operator: string;
  user: string;
  chain: number;
  tokenId: string;
  blockHash: string;
}

export type AssignOperatorEvent = EventWithBlockInfo & {
  operator: string;
  from: string;
}

export type TransferEvent = EventWithBlockInfo & {
  from: string;
  to: string;
  tokenId: string;
}

export type RegisterMercenaryEvent = EventWithBlockInfo & {
  mercenaryAddress: string;
  mercenaryChain: number;
  mercenaryNickname: string;
}

export type UserType = {
    address: string;
    homechain?: number;
    mercenaryChain?: number;
    name: string;
    joined_timestamp: number;
    score: number;
    treasury: number;
    health: number;
    xp: number;
    level: number;
    treasuryLastUpdate: number;
    currentSupportedChainAction?: string;
};

export type AssetStatsType = {
  xp: number;
  health: number;
  level: number;
  attack: number;
  defense: number;
  travelSpeed: number;
  age: number;
  potential: number;
  species: AttackSpeciesType | DefendSpeciesType | FactorySpecies;
};

export type AssetType = AssetStatsType & {
  chain_id: number;
  token_id: string;
  type: string;
  creation_timestamp: number;
  owner: string;
  state: AssetState
  pendingAttackId: number | undefined;
  statsLastUpdate: number;
};

export type AssignOperatorType = {
  chain_id: number;
  assigner: string;
  operator: string;
  timestamp: number;
};


export type LogType = {
  id: number;
  user_address?: string;
  chain?: number;
  timestamp: number;
  comment: string;
};

export interface ChainActionProposalType {
  hash: string;
  sourceChain: number;
  targetChain?: number;
  actionType: ChainActionProposalOption;
  attackArea?: number;
  attackAddress?: string;
  votes: number;
}

export type RangeSelection = {
  ranges: number[];
  maxRnd: number;
}

export type Storage = {
  chains: ChainType[];
  users: UserType[];
  assets: AssetType[];
  assignOperators: AssignOperatorType[];
  logs: LogType[];
  currentPeriodChainActionProposals: ChainActionProposalType[];
  pendingActions: PendingAction[];
  lastProcessedEventAt: number;
  processedPendingIdx: number;
  defendRanges: RangeSelection;
  attackRanges: RangeSelection;
}

export type AssetLevelDetails = {
  level: number;
  levelBoost: number;
  factoryLevelUsed: number;
}

export type DebugData = {
  deadline: number;
  useHardcodedEvents: boolean;
  eventsFile: string;
  gameStartTime: number;
  storageFile: string;
} 
