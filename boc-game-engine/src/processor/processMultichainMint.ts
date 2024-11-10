import { Storage, MultichainMintEvent, AssetTypeOptions, AssetType, AssetStatsType, AssetState, AssetLevelDetails } from './types'; // Import the necessary types
import murmurhash from 'murmurhash'; // Assuming you're using murmurhash
import { getUserTreasury, evolveTreasuryByAddress, subtractFromTreasury, level2xp, isFactory, isCharacter, applyNoise, getCharacterComment, costToMintCharacter, maxCharacterLevelAllowedByTreasury, maxHealthAtLevel, computeRandoms, log2user, chainName } from './utils';
import { AVERAGE_POTENTIAL, HOMECHAIN_BOOST_FACTOR, LEVEL_BOOST_FACTOR } from './constants';
import { FactorySpecies, SpeciesTypicalyStats } from './species';
import { AttackSpeciesType, attackSpeciesStats } from './speciesAttack';
import { DefendSpeciesType, defendSpeciesStats } from './speciesDefend';

// Note that the smart contract forces the asest.type and asset.homechain to exist
export function processMultichainMint(event: MultichainMintEvent, storage: Storage): void {
    console.log(`Processing MultichainMint Event ${event.timestamp}, ${event.user}, TokenID: ${event.tokenId}, Timestamp: ${event.timestamp}, on chain ${event.eventChain}`);
    evolveTreasuryByAddress(event.user, event.timestamp, storage);
    for (let chain of storage.chains) {
        if (isFactory(event.typeId)) {
            createFactory(chain.chain_id, event, storage);
        }
        else if(isCharacter(event.typeId)) {
            createCharacter(chain.chain_id, event, storage);
        }
        else {
            console.log('WARNING: Multimint with not supported asset type', event.typeId);
        }
    }
}

function getBestFactoryLevel(userAddress: string, type: AssetTypeOptions, chain: number, assets: AssetType[]): number {
    return assets
        .filter(a => a.owner === userAddress && a.chain_id === chain && a.type === type)
        .reduce((max, a) => Math.max(max, a.level), 0);
}

function computeCharacterLevelBoost(event: MultichainMintEvent, chain: number, storage: Storage) : AssetLevelDetails {
    const factoryType = event.typeId === AssetTypeOptions.AttackAsset
        ? AssetTypeOptions.AttackFactory
        : AssetTypeOptions.DefenseFactory;
    const bestFactoryLevel = getBestFactoryLevel(event.user, factoryType, chain, storage.assets);
    const level = maxCharacterLevelAllowedByTreasury(bestFactoryLevel, getUserTreasury(event.user, storage.users));
    const levelBoost = 1 + LEVEL_BOOST_FACTOR * level;
    return {
        level: level,
        levelBoost: levelBoost,
        factoryLevelUsed: bestFactoryLevel,
    };
}

function computeHomechainLevelBoost(isHomeChain: boolean) : number {
    return isHomeChain ? 1 + HOMECHAIN_BOOST_FACTOR : 1;
}


function computeSeed(chain: number, event: MultichainMintEvent) : number {
    return murmurhash.v3(
        `${chain}${event.homeChain}${event.blockHash}${event.tokenId}${event.typeId}`
    )
}

function selectSpecies(type: AssetTypeOptions, seed: number, storage: Storage) : [AttackSpeciesType | DefendSpeciesType, SpeciesTypicalyStats] {
    let ranges: number[];
    let maxRnd: number;
    let stats: [AttackSpeciesType | DefendSpeciesType, SpeciesTypicalyStats][];[];

    if (type === AssetTypeOptions.AttackAsset) {
        maxRnd = storage.attackRanges.maxRnd;
        ranges = storage.attackRanges.ranges;
        stats = attackSpeciesStats;
    } else {
        maxRnd = storage.defendRanges.maxRnd;
        ranges = storage.defendRanges.ranges
        stats = defendSpeciesStats;
    }
    const rnd = seed % maxRnd;
    for (let i = 0; i < ranges.length; i++) {
        if (rnd < ranges[i]) return stats[i];
    }
    throw new Error("No species selected; check ranges and stats configuration.");
}

// When minting a character, it fetches the most powerful factory for that asset type
// in the chain where the mint takes place. It then evaluates the level of the asset created by
// spending as much as possible from the treasury.
function createCharacter(chain: number, event: MultichainMintEvent, storage: Storage) {
    const blockSeed = computeSeed(chain, event);
    const rnds = computeRandoms(5, blockSeed);
    const isHomeChain = chain == event.homeChain;
    const [species, _stats] = selectSpecies(event.typeId, blockSeed, storage);

    let stats: AssetStatsType = {
        "health": 0,
        "xp": 0,
        "level": 0,
        "attack": applyNoise(_stats.attack, 50, rnds[1]),
        "defense": applyNoise(_stats.defense, 50, rnds[2]),
        "age": applyNoise(_stats.age, 30, rnds[3]),
        "travelSpeed": applyNoise(_stats.travelSpeed, 30, rnds[4]),
        "potential": _stats.potential,
        "species": species,
    }

    const assetDetails = computeCharacterLevelBoost(event, chain, storage);
    stats.level = assetDetails.level;
    stats.xp = level2xp(assetDetails.level, false);
    stats.health = applyNoise(maxHealthAtLevel(assetDetails.level, false), 30, rnds[0]);
    const homechainBoost = computeHomechainLevelBoost(isHomeChain);

    if (event.typeId == AssetTypeOptions.AttackAsset) {
        stats.attack *= homechainBoost * assetDetails.levelBoost;
        stats.defense *= homechainBoost * assetDetails.levelBoost;
    }
    else {
        stats.attack *= homechainBoost * assetDetails.levelBoost;
        stats.defense *= homechainBoost * assetDetails.levelBoost;
    }

    pushAsset(stats, chain, event, storage);

    const assetCost = costToMintCharacter(assetDetails.level);
    subtractFromTreasury(event.user, event.timestamp, assetCost, storage);

    log2user(
        event.user,
        getCharacterComment(event, chainName(chain, storage.chains), assetDetails, assetCost, species),
        event.timestamp,
        storage.logs
    );
}


function createFactory(chain: number, event: MultichainMintEvent, storage: Storage) {
    let stats = {
        "health": maxHealthAtLevel(0, true),
        "xp": 0,
        "level": 0,
        "attack": 2,
        "defense": 10,
        "travelSpeed": 0,
        "age": 0,
        "potential": AVERAGE_POTENTIAL,
        "species": event.typeId === AssetTypeOptions.AttackFactory ? FactorySpecies.AttackFactory : FactorySpecies.DefendFactory,
    }
    pushAsset(stats, chain, event, storage);
    const comment = `You have created a factory asset on ${chainName(chain, storage.chains)} with tokenId = ${(event.tokenId).toString()}. You can trade it in that chain, and start using it to create better assets.`;
    log2user(event.user, comment, event.timestamp, storage.logs);
}   

function pushAsset(stats: AssetStatsType, chain: number, event: MultichainMintEvent, storage: Storage) {
    storage.assets.push({
        chain_id: chain,
        token_id: (event.tokenId).toString(),
        type: (event.typeId).toString(),
        creation_timestamp: event.timestamp,
        owner: event.user,
        xp: stats.xp,
        health: stats.health,
        level: stats.level,
        attack: stats.attack,
        defense: stats.defense,
        age: stats.age,
        potential: stats.potential,
        travelSpeed: stats.travelSpeed,
        species: stats.species,
        statsLastUpdate: event.timestamp,
        state: AssetState.Free,
        pendingAttackId: undefined,
    });
}
