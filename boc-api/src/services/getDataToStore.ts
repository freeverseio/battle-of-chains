import { User, Asset, ChainActionProposal, Log, AssignOperator } from '../db/entity';
import { UserType, AssetType, ChainActionProposalType, LogType, Storage, AssignOperatorType } from '../processor/types';
import { toChecksumAddress } from 'web3-utils';

function toChecksum(input: any): any {
  if (typeof input === 'string' && input) {
    return toChecksumAddress(input);
  }
  return input;
}

export type StorageToInsert = {
  users: User[];
  assets: Asset[];
  currentPeriodChainActionProposals: ChainActionProposal[];
  assignOperators: AssignOperator[];
  logs: Log[];
}

export function formStorage(storage: Storage): StorageToInsert {
  return {
    users: formUsers(storage.users),
    assets: formAssets(storage.assets),
    currentPeriodChainActionProposals: formCurrentPeriodChainActionProposals(storage.currentPeriodChainActionProposals),
    assignOperators: formAssignOperators(storage.assignOperators),
    logs: formLogs(storage.logs),
  };
}

function formUsers(processedUsers: UserType[]): User[] {
    const usersToInsert: User[] = [];
    for (let user of processedUsers) {
      const newUser = new User();
      newUser.address = toChecksum(user.address);
      newUser.name = user.name;
      newUser.homechain = user.homechain;
      newUser.joined_timestamp = user.joined_timestamp;
      newUser.score = user.score;
      newUser.treasury = user.treasury;
      newUser.health = user.health;
      newUser.xp = user.xp;
      newUser.level = user.level;
      newUser.treasury_last_update = user.treasuryLastUpdate;
      newUser.current_supported_chain_action = user.currentSupportedChainAction;
      usersToInsert.push(newUser);
    }
    return usersToInsert;
}

function formAssets(processedAssets: AssetType[]): Asset[] {
  const assetsToInsert: Asset[] = [];
  for (let asset of processedAssets) {
    const newAsset = new Asset();
    newAsset.chain_id = asset.chain_id;
    newAsset.token_id = asset.token_id;
    newAsset.type = asset.type;
    newAsset.creation_timestamp = asset.creation_timestamp;
    newAsset.owner = toChecksum(asset.owner);
    newAsset.xp = asset.xp;
    newAsset.health = asset.health;
    newAsset.level = asset.level;
    newAsset.attack = asset.attack;
    newAsset.defense = asset.defense;
    newAsset.age = asset.age;
    newAsset.travel_speed = asset.travelSpeed;
    newAsset.potential = asset.potential;
    newAsset.species = asset.species;
    newAsset.stats_last_update = asset.statsLastUpdate;
    newAsset.asset_state = asset.state;
    newAsset.pending_attack_id = asset.pendingAttackId;
    assetsToInsert.push(newAsset);
  }
  return assetsToInsert;
}

function formCurrentPeriodChainActionProposals(processedProposals: ChainActionProposalType[]): ChainActionProposal[] {
  const proposalsToInsert: ChainActionProposal[] = [];
  for (let proposal of processedProposals) {
    const newProposal = new ChainActionProposal();
    newProposal.proposal_hash = proposal.hash;
    newProposal.source_chain_id = proposal.sourceChain;
    newProposal.target_chain_id = proposal.targetChain;
    newProposal.type = proposal.actionType;
    newProposal.attack_area = proposal.attackArea;
    newProposal.attack_address = toChecksum(proposal.attackAddress);
    newProposal.votes = proposal.votes;
    proposalsToInsert.push(newProposal);
  }
  return proposalsToInsert;
}

function formAssignOperators(processedAssignedOperators: AssignOperatorType[]): AssignOperator[] {
  const toInsert: AssignOperator[] = [];
  for (let assignment of processedAssignedOperators) {
    const newAssign = new AssignOperator();
    newAssign.assigner = toChecksum(assignment.assigner);
    newAssign.operator = toChecksum(assignment.operator);
    newAssign.chain_id = assignment.chain_id;
    newAssign.timestamp = assignment.timestamp;
    toInsert.push(newAssign);
  }
  return toInsert;
}

function formLogs(processedLogs: LogType[]): Log[] {
  const logsToInsert: Log[] = [];
  for (let log of processedLogs) {
    const newLog = new Log();
    newLog.id = log.id;
    newLog.user_address = toChecksum(log.user_address);
    newLog.chain = log.chain;
    newLog.timestamp = log.timestamp;
    newLog.comment = log.comment;
    logsToInsert.push(newLog);
  }
  return logsToInsert;
}