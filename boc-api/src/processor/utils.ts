import { Chain, UserType, Storage, XY, AssetType, AssetState, XYmeter, PendingAction, ChainActionProposalType, AssetTypeOptions, AttackArea, RangeSelection, MultichainMintEvent, AssetLevelDetails } from './types';
import * as constants from './constants';
import { isAddress } from 'web3-validator';
import { AssignOperator } from '../db/entity';
import { DefendSpecies, DefendSpeciesLore } from './speciesDefend';
import { AttackSpecies, AttackSpeciesLore } from './speciesAttack';

const maxPoint = BigInt('0xFFFFFFFFFFFFFFFFFFFF');
const midPoint = BigInt('0xFFFFFFFFFFFFFFFFFFFF') / BigInt(2);
const quarterPoint = BigInt('0xFFFFFFFFFFFFFFFFFFFF') / BigInt(4);

export function chainIsNotSupported(chain: Number, chains: Chain[]) : boolean {
    const chainNotSupported = chain && !chains.find(u => u.chain_id === chain);
    if (chainNotSupported) console.log(`An event tried to act on a chain that is not yet supported: ${chain}`);
    return chainNotSupported;
}

export function userDoesNotExist(user: String, users: UserType[]) : boolean {
    const userDoesNotExist = user && !users.find(u => u.address.toLowerCase() === user.toLowerCase());
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
    storage.logs.push({
        id: storage.logs.length,
        user_address: address,
        timestamp: timestamp,
        comment: `A user has been created without homechain, currently playing as a DAO on chain ${chain}`,
    });
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
    evolveTreasuryByUser(user, timestamp);
}

export function evolveTreasuryByUser(user: UserType, timestamp: number) {
    const timeSinceLast = timestamp - user.treasuryLastUpdate;
    const treasuryIncrease = Math.floor((user.health * timeSinceLast ) / constants.ONE_DAY_IN_SECS);
    if (treasuryIncrease < 0) {
        console.log('WARNING: treasury decreasing over time due to incorrect timestamps');
        return;
    }
    user.treasury += treasuryIncrease;
    user.treasuryLastUpdate = timestamp;
}

export function isFactory(typeId: string) : boolean {
    return (typeId === AssetTypeOptions.AttackFactory || typeId === AssetTypeOptions.DefenseFactory);
}

export function isCharacter(typeId: string) : boolean {
    return (typeId === AssetTypeOptions.AttackAsset || typeId === AssetTypeOptions.DefenseAsset);
}

export function increaseAssetHealth(asset: AssetType, amount: number) {
    if (asset.health === 0) {
        console.log('WARNING: trying to increase the health of a dead asset, ', asset.token_id);
        return;
    }
    asset.health = asset.health + amount < 100 ? asset.health + amount : 100;
}

export function evolveAssetStatsByAsset(asset: AssetType, timestamp: number) {
    if (asset.health === 0) {
        console.log('WARNING: trying to evolve a dead asset');
        return;
    }
    const timeSinceLast = (timestamp - asset.statsLastUpdate) * constants.TIME_SPEED_RATIO;
    asset.age += timeSinceLast;
    const extraHealth = Math.floor(constants.HEALTH_IMPROVE_PER_DAY * timeSinceLast / constants.ONE_DAY_IN_SECS);
    if (isCharacter(asset.type)) {
        if (asset.age < 40) increaseAssetHealth(asset, extraHealth);
        else decreaseHealth(constants.HEALTH_DECREASE_PER_DAY_AFTER_60, [asset]);
    }
    asset.statsLastUpdate = timestamp;
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

export function xp2level(xp: number) : number {
    for (let level = 0; level < constants.LEVEL_XP_REQUIREMENTS.length - 1; level++) {
        if (xp < constants.LEVEL_XP_REQUIREMENTS[level + 1]) return level;
    }
    return constants.LEVEL_XP_REQUIREMENTS.length - 1;
}

export function level2xp(level: number) : number {
    const nLevels = constants.LEVEL_XP_REQUIREMENTS.length;
    return (level < nLevels) ?
        constants.LEVEL_XP_REQUIREMENTS[level] :
        constants.LEVEL_XP_REQUIREMENTS[nLevels - 1];
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
    console.log('AAA: ', operatorAddress, userAddress);
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

export function decreaseHealth(amount: number, assets: AssetType[]) {
    for (let asset of assets) {
        asset.health = (asset.health > amount) ? asset.health - amount : 0;
    }
}

export function setAssetsFree(assets: AssetType[]) {
    for (let asset of assets) {
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
    for (let user of storage.users) {
        evolveTreasuryByUser(user, timestamp)
    }
}

export function evolveAllAssetsStats(timestamp: number, storage: Storage) {
    for (let asset of storage.assets.filter((a) => a.health > 0)) {
        evolveAssetStatsByAsset(asset, timestamp)
    }
}

export function evolveAssetsStats(timestamp: number, assets: AssetType[]) {
    for (let asset of assets) {
        evolveAssetStatsByAsset(asset, timestamp)
    }
}

export function updateAllScores(storage: Storage) {
    for (let chain of storage.chains) {
        const usersInChain = storage.users.filter((u) => u.homechain === chain.chain_id);
        let chainScore = 0;
        for (let user of usersInChain) {
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
    for (let proposal of storage.currentPeriodChainActionProposals) {
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
    for (let u of users) {
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

export function increaseAssetXP(asset: AssetType, amount: number) {
    asset.xp += amount;
    asset.level = xp2level(asset.xp);
}

export function executeChainImprove(chain: number, storage: Storage) {
    const allAliveAssetsInChain = storage.assets.filter(e =>
        e.chain_id === chain &&
        e.health > 0
    );
    for (const asset of allAliveAssetsInChain) {
        increaseAssetHealth(asset, 20);
        increaseAssetXP(asset, 50);
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
        return assets.filter((a) => a.chain_id === chain && isInNorth(a.owner))
    }
    else if (attackArea === AttackArea.South) {
        return assets.filter((a) => a.chain_id === chain && isInSouth(a.owner))
    }
    else if (attackArea === AttackArea.East) {
        return assets.filter((a) => a.chain_id === chain && isInEast(a.owner))
    }
    else {
        return assets.filter((a) => a.chain_id === chain && isInWest(a.owner))
    }
}

export function findAllAssetsNearAddress(chain: number, attackAddress: string, assets: AssetType[]) : AssetType[] {
    return assets.filter((a) => a.chain_id === chain && isNearAddress(a.owner, attackAddress))
}

export function rarityToRanges(rarities : number[]) : RangeSelection {
    if (rarities.length === 0) return { ranges: [], maxRnd: 0 };
    const maxRarity = Math.max(...rarities);
    // Min width is 1000, max width is max * 1000:
    const intervalWidths: number[] = rarities.map(rarity => Math.ceil((maxRarity * 1000) / rarity));
    let ranges: number[] = [];
    let current = 0;
    for (let width of intervalWidths) {
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


export function getCharacterComment(event: MultichainMintEvent, chain: number, details: AssetLevelDetails, cost: number, species: DefendSpecies | AttackSpecies) : string {
    const typeName = event.typeId === AssetTypeOptions.AttackAsset ? "attack" : "defense";
    const lore = event.typeId === AssetTypeOptions.AttackAsset
        ? AttackSpeciesLore[species as AttackSpecies]
        : DefendSpeciesLore[species as DefendSpecies];

    let comment = `You have created an asset of type: ${typeName}, and species: ${lore.name}`;
    comment += `, on chain ${chain}, with tokenId = ${(event.tokenId).toString()}`;
    comment += `. ${lore.description}`;
    comment += ` It costed ${cost} from your treasury. The asset has level ${details.level}`;
    if (details.factoryLevelUsed > 0) comment += `. It benefited from using your factory of level ${details.factoryLevelUsed} in that chain`;
    comment += `. You can trade it in that chain.`;
    return comment;
}