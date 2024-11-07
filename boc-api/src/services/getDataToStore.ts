import { User, Asset, ChainActionProposal, Log, AssignOperator, AttackSpecies, DefendSpecies, Chain, NFTType, Info } from '../db/entity';
import { SpeciesTypicalyStats } from '../processor/species';
import { attackSpeciesStats, AttackSpeciesType } from '../processor/speciesAttack';
import { defendSpeciesStats, DefendSpeciesType } from '../processor/speciesDefend';
import { UserType, AssetType, ChainActionProposalType, LogType, Storage, AssignOperatorType, ChainType, nftTypeNames } from '../processor/types';
import { toChecksumAddress } from 'web3-utils';
import { costToMintAsset, getNext2pmUTC, isFactory, level2xp, treasuryProdRatePerDay } from '../processor/utils';
import { XP_CHARACTER_PER_LEVEL } from '../processor/constants';

function toChecksum(input: any): any {
  if (typeof input === 'string' && input) {
    return toChecksumAddress(input);
  }
  return input;
}

export type StorageToInsert = {
  chains: Chain[];
  users: User[];
  assets: Asset[];
  currentPeriodChainActionProposals: ChainActionProposal[];
  assignOperators: AssignOperator[];
  logs: Log[];
  attackSpecies: AttackSpecies[];
  defendSpecies: DefendSpecies[];
  nfttypes: NFTType[];
  info: Info[];
}

export function formStorage(storage: Storage): StorageToInsert {
  return {
    chains: formChains(storage.chains),
    users: formUsers(storage.users),
    assets: formAssets(storage.assets),
    currentPeriodChainActionProposals: formCurrentPeriodChainActionProposals(storage.currentPeriodChainActionProposals),
    assignOperators: formAssignOperators(storage.assignOperators),
    logs: formLogs(storage.logs),
    attackSpecies: formAttackSpecies(attackSpeciesStats),
    defendSpecies: formDefendSpecies(defendSpeciesStats),
    nfttypes: formNFTTypes(),
    info: formInfo()
  };
}

function formChains(chains: ChainType[]): Chain[] {
  const toInsert: ChainType[] = [];
  for (let c of chains) {
    const newChain = new Chain();
    newChain.chain_id = c.chain_id;
    newChain.name = c.name;
    newChain.score = c.score;
    toInsert.push(c);
  }
  return toInsert;
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

export function formAttackSpecies(speciesStats: [AttackSpeciesType, SpeciesTypicalyStats][]): AttackSpecies[] {
  const toInsert: AttackSpecies[] = [];
  for (let i = 0; i < speciesStats.length; i++) {
    const [speciesKey, stats] = speciesStats[i];
    const s = new AttackSpecies();
    s.id = speciesKey;
    s.name = stats.name;
    s.description = stats.description;
    s.rarity = stats.rarity;
    toInsert.push(s);
  }
  return toInsert;
}

export function formDefendSpecies(speciesStats: [DefendSpeciesType, SpeciesTypicalyStats][]): DefendSpecies[] {
  const toInsert: DefendSpecies[] = [];
  for (let i = 0; i < speciesStats.length; i++) {
    const [speciesKey, stats] = speciesStats[i];
    const s = new DefendSpecies();
    s.id = speciesKey;
    s.name = stats.name;
    s.description = stats.description;
    s.rarity = stats.rarity;
    toInsert.push(s);
  }
  return toInsert;
}


export enum AssetTypeOptions {
  AttackAsset = "0",
  DefenseAsset = "1",
  AttackFactory = "2",
  DefenseFactory = "3",
}

export function formNFTTypes(): NFTType[] {
  const toInsert: NFTType[] = [];
  for (let i = 0; i < nftTypeNames.length; i++) {
    const s = new NFTType();
    s.id = i;
    s.name = nftTypeNames[i];
    s.xp_levels = Array.from({ length: XP_CHARACTER_PER_LEVEL.length }, (_, level) => 
      level2xp(level, isFactory(i.toString()))
    );
    s.cost_levels = Array.from({ length: XP_CHARACTER_PER_LEVEL.length }, (_, level) => 
      costToMintAsset(level, isFactory(i.toString()))
    );
    toInsert.push(s);
  }
  return toInsert;
}


export function formInfo(): Info[] {
  const toInsert: Info[] = [];
  const nextChainAction = getNext2pmUTC(Math.floor(Date.now() / 1000));
  const isFact = true;
  const homebase_xp = Array.from({ length: XP_CHARACTER_PER_LEVEL.length }, (_, level) => 
    level2xp(level, isFact)
  );
  const homebase_cost = Array.from({ length: XP_CHARACTER_PER_LEVEL.length }, (_, level) => 
    costToMintAsset(level, isFact)
  );
  const homebase_prodrate = Array.from({ length: XP_CHARACTER_PER_LEVEL.length }, (_, level) => 
    treasuryProdRatePerDay(level)
  );
  console.log(XP_CHARACTER_PER_LEVEL.length, homebase_prodrate);

  const items = [
    { key: 'NEXT_CHAIN_ACTIONS_TIMESTAMP', value: nextChainAction },
    { key: 'HOMEBASE_DAILY_PRODUCTION_RATE', value: homebase_prodrate },
    { key: 'HOMEBASE_XP_PER_LEVEL', value: homebase_xp },
    { key: 'HOMEBASE_COST_PER_LEVEL', value: homebase_cost }
  ];

  for (const item of items) {
    const info = new Info();
    info.key = item.key;
    info.value = item.value;
    toInsert.push(info);
  }

  return toInsert;
}