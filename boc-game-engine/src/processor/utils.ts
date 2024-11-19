import { ChainType, UserType, Storage, XY, AssetType, AssetState, XYmeter, PendingAction, ChainActionProposalType, AssetTypeOptions, AttackArea, RangeSelection, MultichainMintEvent, AssetLevelDetails, UpgradeEvent } from './types';
import * as constants from './constants';
import { isAddress } from 'web3-validator';
import { AssignOperator, Log } from '../db/entity';
import { DefendSpeciesType, DefendSpeciesLore } from './speciesDefend';
import { AttackSpeciesType, AttackSpeciesLore } from './speciesAttack';
import murmurhash from 'murmurhash';

const maxPoint = BigInt('0xFFFFFFFFFFFFFFFFFFFF');
const midPoint = BigInt('0xFFFFFFFFFFFFFFFFFFFF') / BigInt(2);
const quarterPoint = BigInt('0xFFFFFFFFFFFFFFFFFFFF') / BigInt(4);

export function readableDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}, UTC`;
}



export function chainName(chain: number | undefined, chains: ChainType[]) : string {
    if (!chain) return '';
    for (const c of chains) {
        if (c.chain_id === chain) return c.name;
    }
    return `chain ${chain}`;
} 

export function log2user(address: string, comment: string, timestamp: number, logs: Log[]) {
    logs.push({
        id: logs.length,
        user_address: address,
        timestamp: timestamp,
        comment: comment,
    });
}

export function log2chain(chain: number, comment: string, timestamp: number, logs: Log[]) {
    logs.push({
        id: logs.length,
        chain: chain,
        timestamp: timestamp,
        comment: comment,
    });
}

export function chainIsNotSupported(chain: number, chains: ChainType[]) : boolean {
    const chainNotSupported = !!chain && !chains.some(u => u.chain_id === chain);
    if (chainNotSupported) console.log(`An event tried to act on a chain that is not yet supported: ${chain}`);
    return chainNotSupported;
}

export function userDoesNotExist(user: string, users: UserType[]) : boolean {
    const userDoesNotExist = !!user && !users.some(u => u.address.toLowerCase() === user.toLowerCase());
    if (userDoesNotExist) console.log(`An event tried to act on a user that does not exist: ${user}`);
    return userDoesNotExist;
}

export function createDAO(storage: Storage, address: string, chain: number, timestamp: number) {
    storage.users.push(
        {
            address: address,
            name: `DAO on chain ${chain}`,
            joined_timestamp: timestamp,
            score: 44,
            treasury: 0,
            treasuryLastUpdate: timestamp,
            health: 100,
            xp: 0,
            level: 0
        }
    );
    log2user(
        address,
        `A user has been created without homechain, currently playing as a DAO on ${chainName(chain, storage.chains)}`,
        timestamp,
        storage.logs,
    );
}

export function findUser(address: string, users: UserType[]) : UserType  | undefined {
    return  users.find(u => u.address === address);
}

export function findSlowestAssetSpeed(actionId: number, assets: AssetType[]): number {
    const speeds = assets
        .filter(a => a.pendingAttackId === actionId)
        .map(a => a.travelSpeed);
    return speeds.length > 0 ? Math.min(...speeds) : 10;
}

export function getAttackingAssets(actionId: number, assets: AssetType[]): AssetType[] {
    return assets.filter(a => a.pendingAttackId === actionId)
}

export function getAlive(assets: AssetType[]): AssetType[] {
    return assets.filter(a => a.health > 0)
}

export function getAliveAndFree(assets: AssetType[]): AssetType[] {
    return assets.filter(a => a.state === AssetState.Free && a.health > 0)
}

export function getFreeInventoryInChain(address: string, chain: number, assets:AssetType[]) : AssetType[] {
    return assets.filter(a => a.owner === address && a.chain_id === chain && a.state === AssetState.Free);
}

export function getAliveInventoryInChain(address: string, chain: number, assets:AssetType[]) : AssetType[] {
    return assets.filter(a => a.owner === address && a.chain_id === chain && a.health > 0);
}

function assetCanPrepareForAttack(asset: AssetType) : boolean {
    return (
        asset.state === AssetState.Free &&
        asset.health > 0 &&
        isCharacter(asset.type)
    );
}

export function getAllAssetsThatCanPrepareForAttack(address: string, chain: number, assets:AssetType[]) : AssetType[] {
    return assets.filter(a =>
        a.owner === address &&
        a.chain_id === chain &&
        assetCanPrepareForAttack(a)
    );
}

export function getAllAssetsThatCanPrepareForAttackAmong(address: string, chain: number, assets:AssetType[], tokenIds: string[]) : AssetType[] {
    return assets.filter(a =>
        tokenIds.includes(a.token_id) &&
        a.owner === address &&
        a.chain_id === chain &&
        assetCanPrepareForAttack(a)
    );
}

export function getUserTreasury(address: string, users: UserType[]) : number {
    const user = users.find(u => u.address === address);
    return user ? user.treasury : 0;
}

// If Rate = 100, it will increase treasury by 100 every day. 
export function evolveTreasuryByAddress(address: string, timestamp: number, storage: Storage) {
    const user = findUser(address, storage.users);
    if (!user) {
        console.log('WARNING: trying to update treasury of non-found user address: ', address);
        return;
    }
    evolveTreasuryByUser(user, timestamp, storage);
}

export function costToMintCharacter(level: number) {
    return constants.XP_CHARACTER_PER_LEVEL[level] * constants.COST_PER_XP;
}

export function costToMintFactory(level: number) {
    return constants.XP_FACTORY_PER_LEVEL[level] * constants.COST_PER_XP;
}

export function costToMintAsset(level: number, isFactory: boolean) {
    return isFactory
        ? costToMintFactory(level)
        : costToMintCharacter(level);
}

export function computeReferenceTreasuryCostAtLevel(level: number) : number {
    let costOfCreatingCharacterOfRelevantLevel : number;
    if (level == 0) costOfCreatingCharacterOfRelevantLevel = costToMintCharacter(1);
    else if (level == 1) costOfCreatingCharacterOfRelevantLevel = 2 * costToMintCharacter(1);
    else costOfCreatingCharacterOfRelevantLevel = costToMintCharacter(level);
    return costOfCreatingCharacterOfRelevantLevel;
}

export function treasuryProdRatePerDay(level: number) : number {
    return Math.round(constants.ONE_DAY_IN_SECS * treasuryProdRatePerSec(level));
}

export function treasuryProdRatePerSec(level: number) : number {
    return computeReferenceTreasuryCostAtLevel(level)
        * constants.TREASURY_ASSETS_OF_MATCHING_LEVEL_PER_WEEK[level]
        / constants.ONE_WEEK_IN_SECS;
}

export function treasuryPenaltyPerSec(level: number, assetCount: number) : number {
    return computeReferenceTreasuryCostAtLevel(level)
        *  assetCount * constants.TREASURY_COST_TO_MAINTAIN_ONE_ASSET_PER_WEEK
        / constants.ONE_WEEK_IN_SECS;
}

export function hasHomechain(user: UserType) : boolean {
    return !!user.homechain;
}

export function isMercenary(user: UserType) : boolean {
    return !!user.mercenaryChain;
}

export function evolveTreasuryByUser(user: UserType, timestamp: number, storage: Storage) {
    if (!hasHomechain(user)) return;
    const secSinceLast = timestamp - user.treasuryLastUpdate;
    if (secSinceLast < 0) {
        console.log('WARNING: trying to evolve a treasury towards the past', user);
        return;
    }
    const assetCount = storage.assets.filter(a => a.owner === user.address && a.health > 0 && !isFactory(a.type)).length;
    const treasuryIncrease = Math.floor(
        secSinceLast *
        (treasuryProdRatePerSec(user.level) - treasuryPenaltyPerSec(user.level, assetCount))
    );
    user.treasury = Math.max(0, user.treasury + treasuryIncrease);
    user.treasuryLastUpdate = timestamp;
}

export function isFactory(typeId: string) : boolean {
    return (typeId === AssetTypeOptions.AttackFactory || typeId === AssetTypeOptions.DefenseFactory);
}

export function isCharacter(typeId: string) : boolean {
    return (typeId === AssetTypeOptions.AttackAsset || typeId === AssetTypeOptions.DefenseAsset);
}

export function maxHealthAtLevel(level: number, isFactory: boolean) : number {
    return level2xp(
        Math.max(1, level),
        isFactory
    );
}

export function addHealthDeltaToAsset(delta: number, asset: AssetType) {
    if (asset.health === 0) {
        console.log('WARNING: trying to modify the health of a dead asset, ', asset.token_id);
        return;
    }
    const intDelta = Math.ceil(delta);
    if (intDelta < 0) {
        console.log('decreasing', asset.health, intDelta);
        asset.health = asset.health + intDelta > 0 ? asset.health + intDelta : 0;
    } else {
        const maxHealth = maxHealthAtLevel(asset.level, isFactory(asset.type));
        const newHealth = asset.health + intDelta;
        asset.health = newHealth > maxHealth ? maxHealth : newHealth;
    }
}

export function age2years(ageInSec: number) : number {
    return ageInSec / constants.ONE_YEAR_IN_SECS;
}

export function evolveAssetStatsByAsset(asset: AssetType, timestamp: number) {
    if (asset.health === 0) {
        console.log('WARNING: trying to evolve a dead asset');
        return;
    }
    const timeSinceLast = (timestamp - asset.statsLastUpdate) * constants.TIME_SPEED_RATIO;
    asset.age += timeSinceLast;

    const isFact = isFactory(asset.type);
    const maxHealth = maxHealthAtLevel(asset.level, isFactory(asset.type));

    // the default delta (applied to all factories, and to all young assets)
    let healthDelta = Math.floor(
        maxHealth *
        ((timestamp - asset.statsLastUpdate) / constants.ONE_DAY_IN_SECS)*
        (constants.HEALTH_PERCENT_IMPROVE_PER_REAL_LIFE_DAY / 100)
    );

    if (!isFact && age2years(asset.age) > 60) healthDelta = - healthDelta / 7;
    else if (!isFact && age2years(asset.age) > 40) healthDelta = healthDelta / 3;

    addHealthDeltaToAsset(healthDelta, asset);

    asset.statsLastUpdate = timestamp;

    if (asset.health === 0) {
        console.log('WARNING: Asset killed by time evolution', asset);
    }
}

export function subtractFromTreasury(address: string, timestamp: number, amount: number, storage: Storage) : number {
    const user = findUser(address, storage.users);
    if (!user) {
        console.log('WARNING: trying to subtract from treasury of non-found user address: ', address);
        return 0;
    }
    const subtractedAmount = user.treasury > amount ? amount : user.treasury;
    user.treasury -= subtractedAmount;
    user.treasuryLastUpdate = timestamp;
    return subtractedAmount;
}

export function addToTreasury(address: string, timestamp: number, amount: number, storage: Storage) {
    const user = findUser(address, storage.users);
    if (!user) {
        console.log('WARNING: trying to subtract from treasury of non-found user address: ', address);
        return;
    }
    if (amount < 0) {
        console.log('WARNING: trying to add a negative number to the treasury!: ');
        return;
    }
    user.treasury += amount;
    user.treasuryLastUpdate = timestamp;
}

export function xp2level(xp: number, isFactory: boolean) : number {
    const LEVEL_TO_XP = isFactory
    ? constants.XP_FACTORY_PER_LEVEL
    : constants.XP_CHARACTER_PER_LEVEL;

    for (let level = 0; level < LEVEL_TO_XP.length - 1; level++) {
        if (xp < LEVEL_TO_XP[level + 1]) return level;
    }
    return LEVEL_TO_XP.length - 1;
}

export function maxXPAtLevel(level: number, isFactory: boolean) : number {
    return level2xp(level + 1, isFactory);
}

export function level2xp(level: number, isFactory: boolean) : number {
    const LEVEL_TO_XP = isFactory
        ? constants.XP_FACTORY_PER_LEVEL
        : constants.XP_CHARACTER_PER_LEVEL;

    const nLevels = LEVEL_TO_XP.length;
    return (level < nLevels) ?
        LEVEL_TO_XP[level] :
        LEVEL_TO_XP[nLevels - 1];
}

export function address2XY(address: string): XY {
    if (!isAddress(address)) {
        throw new Error("Invalid 160 bit address");
    }

    const x = BigInt(`0x${address.slice(2, 22)}`);
    const y = BigInt(`0x${address.slice(22, 42)}`);

    return { x, y };
}

export function xyToAddress(x: bigint, y: bigint): string {
    // Convert each BigInt (80-bit values) to hex strings,
    // making sure they spread across 20 chars
    const first80Bits = x.toString(16).padStart(20, '0');
    const second80Bits = y.toString(16).padStart(20, '0');

    return `0x${first80Bits}${second80Bits}`;
}

export function isCorrectOperator(operatorAddress: string, userAddress: string, assignOperators: AssignOperator[]) : boolean {
    if (!operatorAddress || !userAddress) return false;
    if (operatorAddress === userAddress) return true;
    const assignment = assignOperators.find(a => a.operator === operatorAddress && a.assigner === userAddress);
    return assignment ? true : false;
}

export function address2XYMeter(address: string): XYmeter {
    if (!isAddress(address)) {
        throw new Error("Invalid 160 bit address");
    }

    // with 5 hex = 20 bit, one can express 2**20 = 1048576 meter ~ 1048 Km
    const xInMeter = BigInt(`0x${address.slice(2, 2 + 5)}`);
    const yInMeter = BigInt(`0x${address.slice(22, 22 + 5)}`);

    return { x: Number(xInMeter), y: Number(yInMeter) };
}

// Returns distance between 2 addresses, measured in meters
export function distanceMeter(addr1: string, addr2: string) : number {
    const xy1 = address2XYMeter(addr1);
    const xy2 = address2XYMeter(addr2);
    return Math.ceil(Math.sqrt((xy1.x -xy2.x)**2 + (xy1.y -xy2.y)**2));
}

// Returns the time (in sec) it takes to travel between addr1 & addr2 at the provided speed (in m/s)
export function time2travel(addr1: string, addr2: string, speed: number) : number {
    return time2travelDistance(distanceMeter(addr1, addr2), speed);
}

export function time2travelDistance(distance: number, speed: number) : number {
    return Math.ceil(distance / speed / constants.TIME_SPEED_RATIO);
}

export function setAssetsFree(assets: AssetType[]) {
    for (const asset of assets) {
        asset.state = AssetState.Free;
        asset.pendingAttackId = undefined;
    }
}

export function removePendingAction(actionId: number, pendingActions: PendingAction[]) {
    const index = pendingActions.findIndex(a => a.id === actionId);
    if (index !== -1) {
        pendingActions.splice(index, 1);
        return;
    }
    console.log('WARNING: Pending action was supposed to be removed, but not found!', actionId);
}

export function getNextPendingActionBefore(deadline: number, pendingActions: PendingAction[]): PendingAction | undefined {
    const actionsBeforeDeadline = pendingActions.filter(e => e.toBeExectutedAt <= deadline);

    if (actionsBeforeDeadline.length === 0) {
        return undefined;
    }

    let nextAction = actionsBeforeDeadline[0];
    for (const action of actionsBeforeDeadline) {
        if (action.toBeExectutedAt < nextAction.toBeExectutedAt) {
            nextAction = action;
        }
    }
    return nextAction;
}

export function assignUserToChainProposal(userAddress: string, proposalHash: string, users: UserType[], proposals: ChainActionProposalType[]) {
    const user = findUser(userAddress, users);
    if (!user) {
        console.log('WARNING: user not found when assigning it to proposal', user);
        return;
    }
    const proposal = proposals.find((p) => p.hash === proposalHash);
    if (!proposal) {
        console.log('WARNING: trying to support a proposal that does not exist!!!', user, proposalHash);
        return;
    }
    user.currentSupportedChainAction = proposalHash;
}

export function updateAllTreasuries(timestamp: number, storage: Storage) {
    for (const user of storage.users) {
        evolveTreasuryByUser(user, timestamp, storage)
    }
}

export function evolveAllAssetsStats(timestamp: number, storage: Storage) {
    for (const asset of storage.assets.filter((a) => a.health > 0)) {
        evolveAssetStatsByAsset(asset, timestamp)
    }
}

export function evolveAssetsStats(timestamp: number, assets: AssetType[]) {
    for (const asset of assets) {
        evolveAssetStatsByAsset(asset, timestamp)
    }
}

export function updateAllScores(storage: Storage) {
    for (const chain of storage.chains) {
        const usersInChain = storage.users.filter((u) => u.homechain === chain.chain_id);
        let chainScore = 0;
        for (const user of usersInChain) {
            const score = storage.assets
                .filter(asset => asset.owner === user.address && asset.health > 0)
                .reduce((sum, asset) => sum + asset.xp, 0);
            user.score = score;
            chainScore += score;
        }
        chain.score = chainScore;
    }
}

export function updateAllChainProposalVotes(timestamp: number, storage: Storage) {
    updateAllTreasuries(timestamp, storage);
    for (const proposal of storage.currentPeriodChainActionProposals) {
        const supporters = storage.users.filter(u => u.currentSupportedChainAction === proposal.hash);
        proposal.votes = supporters.reduce((sum, supporter) => sum + supporter.treasury, 0);
    }
}

export function updateLastProcessedEventAt(timestamp: number, storage : Storage) {
    storage.lastProcessedEventAt = timestamp;
}

export function selectMostVotedChainAction(chainId: number, timestamp: number, storage: Storage) : ChainActionProposalType | undefined {
    updateAllChainProposalVotes(timestamp, storage);

    const proposalsForChain = storage.currentPeriodChainActionProposals.filter(
        proposal => proposal.sourceChain === chainId
    );
    let mostVoted: ChainActionProposalType | undefined = undefined;
    let maxVotes = -1;
    for (const proposal of proposalsForChain) {
        if (proposal.votes > maxVotes) {
            maxVotes = proposal.votes;
            mostVoted = proposal;
        }
    }
    return mostVoted;
}

export function removeAllUserSupportedActions(users: UserType[]) {
    for (const u of users) {
        u.currentSupportedChainAction = undefined;
    }
}

// Fisher-Yates shuffle using a seeded PRNG
export function shuffleArray<T>(array: T[], seed: number): T[] {
    function seededRandom(seed: number): () => number {
        return function() {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    }

    const randomFunc = seededRandom(seed);

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randomFunc() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function increaseAssetHealthByPercent(asset: AssetType, percent: number) {
    const maxHealth = maxHealthAtLevel(asset.level, isFactory(asset.type));
    const newHealth = asset.health + Math.ceil(maxHealth * percent/100);
    asset.health = newHealth > maxHealth ? maxHealth : newHealth;
}

export function decreaseAssetHealthByPercent(asset: AssetType, percent: number) {
    const maxHealth = maxHealthAtLevel(asset.level, isFactory(asset.type));
    const newHealth = asset.health - Math.ceil(maxHealth * percent/100);
    asset.health = newHealth > 0 ? newHealth : 0;
}

export function increaseAssetXPByPercent(asset: AssetType, percent: number) {
    const XPAtLevel = maxXPAtLevel(asset.level, isFactory(asset.type));
    asset.xp += Math.ceil(XPAtLevel * Math.min(100, percent) / 100);
    asset.level = xp2level(asset.xp, isFactory(asset.type));
}

export function executeChainImprove(chain: number, storage: Storage) {
    const allAliveAssetsInChain = storage.assets.filter(e =>
        e.chain_id === chain &&
        e.health > 0
    );
    for (const asset of allAliveAssetsInChain) {
        increaseAssetHealthByPercent(asset, constants.HEALTH_INCREASE_PERCENTAGE_ON_CHAIN_IMPROVE);
        increaseAssetXPByPercent(asset, constants.XP_INCREASE_PERCENTAGE_ON_CHAIN_IMPROVE);
    }
}

function isInNorth(address: string) : boolean {
    const {x, y} = address2XY(address);
    const isNW = x < midPoint && (x + y) >= maxPoint;
    const isNE = x >= midPoint && y >= x;
    return isNW || isNE;
}

function isInSouth(address: string) : boolean {
    const {x, y} = address2XY(address);
    const isSW = x < midPoint && y < x;
    const isSE = x >= midPoint && (x + y) < maxPoint;
    return isSW || isSE;
}

function isInEast(address: string) : boolean {
    const {x, y} = address2XY(address);
    const isAbove = y >= x;
    const isBelow = (x + y) < maxPoint;
    return (x < midPoint) && isAbove && isBelow;
}

function isInWest(address: string) : boolean {
    const {x, y} = address2XY(address);
    const isAbove = y >= x;
    const isBelow = (x + y) < maxPoint;
    return (x >= midPoint) && isAbove && isBelow;
}

function isNearAddress(testAddress: string, targetAddress: string) : boolean {
    const {x, y} = address2XY(targetAddress);
    const leftMost = x > quarterPoint ? x - quarterPoint : 0;
    const rightMost = maxPoint > x + quarterPoint ? x + quarterPoint : maxPoint;
    const downMost = y > quarterPoint ? y - quarterPoint : 0;
    const upMost = maxPoint > y + quarterPoint ? y + quarterPoint : maxPoint;

    const test = address2XY(testAddress);
    return (test.x >= leftMost ) && (test.x <= rightMost) && (test.y >= downMost ) && (test.y <= upMost);
}

export function findAllAssetsInArea(chain: number, attackArea: AttackArea, assets: AssetType[]) : AssetType[] {
    if (attackArea === AttackArea.Null) {
        console.log('WARNING: chain attack selected NULL region');
        return [];
    }
    if (attackArea === AttackArea.North) {
        return assets.filter((a) => a.chain_id === chain && isInNorth(a.owner) && a.health > 0)
    }
    else if (attackArea === AttackArea.South) {
        return assets.filter((a) => a.chain_id === chain && isInSouth(a.owner) && a.health > 0)
    }
    else if (attackArea === AttackArea.East) {
        return assets.filter((a) => a.chain_id === chain && isInEast(a.owner) && a.health > 0)
    }
    else if (attackArea === AttackArea.West) {
        return assets.filter((a) => a.chain_id === chain && isInWest(a.owner) && a.health > 0)
    } 
    else if (attackArea === AttackArea.All) {
        return assets.filter((a) => a.chain_id === chain && a.health > 0)
    }
    else {
        console.log('WARNING: chain attack area not supported');
        return [];
    }
}

export function findAllAssetsNearAddress(chain: number, attackAddress: string, assets: AssetType[]) : AssetType[] {
    return assets.filter((a) => a.chain_id === chain && isNearAddress(a.owner, attackAddress) && a.health > 0)
}

export function rarityToRanges(rarities : number[]) : RangeSelection {
    if (rarities.length === 0) return { ranges: [], maxRnd: 0 };
    const maxRarity = Math.max(...rarities);
    // Min width is 1000, max width is max * 1000:
    const intervalWidths: number[] = rarities.map(rarity => Math.ceil((maxRarity * 1000) / rarity));
    const ranges: number[] = [];
    let current = 0;
    for (const width of intervalWidths) {
      current += width;
      ranges.push(current);
    }
    return {
        ranges,
        maxRnd: Math.max(...ranges)
    };
}

// percentage is relative to 100
// it will never return less than 1
export function applyNoise(n: number, noisePercentage: number, seed: number) : number {
    const delta = Math.round(n * noisePercentage * (seed % 100) / 10000);
    const sign = seed % 2 === 0 ? 1 : -1;
    const val = n + sign * delta;
    return val > 1 ? val : 1;  
}


export function getCharacterComment(event: MultichainMintEvent, chain: string, details: AssetLevelDetails, cost: number, species: DefendSpeciesType | AttackSpeciesType) : string {
    const typeName = event.typeId === AssetTypeOptions.AttackAsset ? "attack" : "defense";
    const lore = event.typeId === AssetTypeOptions.AttackAsset
        ? AttackSpeciesLore[species as AttackSpeciesType]
        : DefendSpeciesLore[species as DefendSpeciesType];

    let comment = `You have created an asset of type: ${typeName}, and species: ${lore.name}`;
    comment += `, on ${chain}, with tokenId = ${(event.tokenId).toString()}`;
    comment += `. ${lore.description}`;
    comment += ` It costed ${cost} from your treasury. The asset has level ${details.level}`;
    if (details.level < details.factoryLevelUsed) {
        comment += `. Depite having a factory of level ${details.factoryLevelUsed} in that chain, your treasury was only enough to produce an asset of level ${details.level}`;
    }
    if (details.level > 0 && details.level === details.factoryLevelUsed) {
        comment += `. It benefited from using your factory of level ${details.factoryLevelUsed} in that chain`;
    }
    comment += `. You can trade this asset in that chain.`;
    return comment;
}

export function upgradeAssetToLevel(asset: AssetType, newLevel: number) {
    if (newLevel <= asset.level) {
        console.log('WARNING: Trying to update stats to same or to previous level', asset);
        return;
    }
    const isFact = isFactory(asset.type);
    const newLevelXP = level2xp(newLevel, isFact);
    const oldLevelXP = level2xp(asset.level, isFact);

    const increaseRatio = oldLevelXP > 0
        ? (newLevelXP / oldLevelXP) * (asset.potential / constants.AVERAGE_POTENTIAL)
        : constants.STATS_FACTOR_TO_NEXT_LEVEL;

    asset.attack = Math.ceil(asset.attack * increaseRatio);
    asset.defense = Math.ceil(asset.defense * increaseRatio);
    asset.health = Math.ceil(Math.min(asset.health / oldLevelXP, 1) * newLevelXP);

    asset.xp = level2xp(newLevel, isFact);
    asset.level = newLevel;
}

export function maxCharacterLevelAllowedByTreasury(factoryLevel: number, treasury: number) : number {
    if (factoryLevel == 0) return 0;
    for (let l = 0; l < factoryLevel; l++) {
        if (treasury < costToMintCharacter(l + 1)) return l;
    }
    return factoryLevel;
}

export function computeRandoms(nSeeds: number, seed: number): number[] {
    const rnds: number[] = [murmurhash.v3(seed.toString())];
    for (let i = 1; i < nSeeds; i++) {
        rnds.push(murmurhash.v3(rnds[i - 1].toString()));
    }
    return rnds;
}

export function adaptPercetangeToAverage(percent: number, individualValue: number, averageValue: number) {
    const adapted = Math.round(percent * individualValue / averageValue);
    const max = Math.min(100, Math.round(2 * percent));
    const min = Math.round(percent / 2);
    return Math.max(min, Math.min(max, adapted));
}

export function isUpgradeHomebase(event: UpgradeEvent) : boolean {
    return event.tokenId === '0';
}

export function getNext2pmUTC(referenceTimestamp: number): number {
    const reference = new Date(referenceTimestamp * 1000);
    
    // Create a new Date object for the dat of the reference time, at 2 PM UTC
    const next2pmUTC = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate(), 14, 0, 0, 0));

    // If 2 PM UTC today had already passed, set it to 2 PM UTC of the day after
    if (reference.getUTCHours() >= 14) {
        next2pmUTC.setUTCDate(next2pmUTC.getUTCDate() + 1);
    }

    // Return the timestamp (seconds since epoch)
    return Math.round(next2pmUTC.getTime() / 1000);
}

export function canUserVoteInChain(user: UserType, chain: number) : boolean {
    return hasHomechain(user)
        ? user.homechain === chain
        : false;
}

export function canUserAttackOrUpgradeOnChain(user: UserType, chain: number) : boolean {
    if (hasHomechain(user)) return true;
    if (isMercenary(user)) return user.mercenaryChain === chain;
    return false;
}