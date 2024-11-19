import { adaptPercetangeToAverage, applyNoise, computeReferenceTreasuryCostAtLevel, costToMintCharacter, decreaseAssetHealthByPercent, getNext2pmUTC, isFactory, level2xp, maxCharacterLevelAllowedByTreasury, maxHealthAtLevel, rarityToRanges, treasuryPenaltyPerSec, treasuryProdRatePerDay, treasuryProdRatePerSec, xp2level } from './utils';
import * as constants from './constants';
import { AssetState, AssetType, AssetTypeOptions, RangeSelection } from './types';
import { AttackSpeciesType } from './speciesAttack';

describe('level2xp function', () => {
    test('returns correct XP for levels within range', () => {
        expect(level2xp(0, false)).toBe(0);
        expect(level2xp(1, false)).toBe(10);
        expect(level2xp(2, false)).toBe(50);
    });

    test('returns the maximum XP for levels exceeding the range', () => {
        const maxXp = constants.XP_CHARACTER_PER_LEVEL[constants.XP_CHARACTER_PER_LEVEL.length - 1];
        expect(level2xp(12, false)).toBe(maxXp); // Levels beyond range return last XP level
        expect(level2xp(100, false)).toBe(maxXp);
    });

    test('returns the correct XP for the last level in the range', () => {
        const lastIndex = constants.XP_CHARACTER_PER_LEVEL.length - 1;
        expect(level2xp(lastIndex, false)).toBe(constants.XP_CHARACTER_PER_LEVEL[lastIndex]);
    });
});


describe('xp2level function', () => {
    test('returns correct level for XP within defined ranges', () => {
        expect(xp2level(0, false)).toBe(0);     // XP 0 should be level 0
        expect(xp2level(9, false)).toBe(0);     // XP 9 should still be level 0
        expect(xp2level(10, false)).toBe(1);    // XP 10 should be level 1
        expect(xp2level(49, false)).toBe(1);    // XP 49 should still be level 1
        expect(xp2level(50, false)).toBe(2);    // XP 50 should be level 2
    });

    test('returns maximum level for XP above the highest threshold', () => {
        const maxLevel = constants.XP_CHARACTER_PER_LEVEL.length - 1;
        expect(xp2level(10000000000, false)).toBe(maxLevel); // XP equal to highest threshold should be max level
        expect(xp2level(10000000001, false)).toBe(maxLevel); // XP above highest threshold should still be max level
        expect(xp2level(20000000000, false)).toBe(maxLevel); // XP far above highest threshold should still be max level
    });
});

describe('rarityToRanges', () => {
    it('should return correct ranges and maxRnd for a simple input', () => {
        const rarities = [1, 2, 3];
        const result: RangeSelection = rarityToRanges(rarities);

        expect(result.ranges).toEqual([3000, 4500, 5500]);
        expect(result.maxRnd).toBe(5500);
    });

    it('should return correct ranges and maxRnd for a simple input (reversed order)', () => {
        const rarities = [3, 2, 1];
        const result: RangeSelection = rarityToRanges(rarities);

        expect(result.ranges).toEqual([1000, 2500, 5500]);
        expect(result.maxRnd).toBe(5500);
    });

    it('should handle input where all rarities are the same', () => {
        const rarities = [2, 2, 2];
        const result: RangeSelection = rarityToRanges(rarities);

        expect(result.ranges).toEqual([1000, 2000, 3000]);
        expect(result.maxRnd).toBe(3000);
    });

    it('should return correct ranges and maxRnd for a single rarity', () => {
        const rarities = [10];
        const result: RangeSelection = rarityToRanges(rarities);

        expect(result.ranges).toEqual([1000]);
        expect(result.maxRnd).toBe(1000);
    });

    it('should handle an empty array by returning empty ranges and maxRnd as 0', () => {
        const rarities: number[] = [];
        const result: RangeSelection = rarityToRanges(rarities);

        expect(result.ranges).toEqual([]);
        expect(result.maxRnd).toBe(0);
    });
});

describe('applyNoise', () => {
  
  it('should return the same value when noisePercentage is 0', () => {
    expect(applyNoise(100, 0, 123)).toBe(100);
    expect(applyNoise(50, 0, 456)).toBe(50);
  });

  it('should apply positive noise when seed is even', () => {
    const result = applyNoise(100, 10, 124); // 10% noise, even seed
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(110);
  });

  it('should apply negative noise when seed is odd', () => {
    const result = applyNoise(100, 10, 125); // 10% noise, odd seed
    expect(result).toBeLessThanOrEqual(100);
    expect(result).toBeGreaterThanOrEqual(90);
  });

  it('should never return less than 1 even with high noise and low input', () => {
    expect(applyNoise(1, 100, 789)).toBe(1); // High noise on small value
    expect(applyNoise(5, 100, 789)).toBeGreaterThanOrEqual(1);
  });

  it('should handle a large value with high noise', () => {
    const result = applyNoise(1000, 50, 234);
    expect(result).toBeGreaterThanOrEqual(500);
    expect(result).toBeLessThanOrEqual(1500);
  });

  it('should return the exact value when noisePercentage is 100 and seed gives zero delta', () => {
    const result = applyNoise(100, 100, 200); // noisePercentage = 100%, seed makes delta zero
    expect(result).toBe(100);
  });
});

describe('maxCharacterLevelAllowedByTreasury', () => {
    it('should return 0 if factoryLevel is 0', () => {
        expect(maxCharacterLevelAllowedByTreasury(0, 1000)).toBe(0);
    });

    it('should return 0 if treasury is less than the cost for level 1', () => {
        expect(maxCharacterLevelAllowedByTreasury(1, 2)).toBe(0);
    });

    it('should return the highest level allowed by the treasury', () => {
        const costOfLevel3 = costToMintCharacter(3);
        expect(maxCharacterLevelAllowedByTreasury(3, costOfLevel3 - 1)).toBe(2);
        expect(maxCharacterLevelAllowedByTreasury(3, costOfLevel3 + 1)).toBe(3);
    });
});

describe("decreaseAssetHealthByPercent", () => {
    const mockAsset = (level: number, health: number, type: AssetTypeOptions): AssetType => ({
        level,
        health,
        type,
        xp: 0,
        attack: 10,
        defense: 10,
        travelSpeed: 5,
        age: 0,
        potential: 5,
        species: AttackSpeciesType.Bullshiter,
        chain_id: 0,
        token_id: '0',
        creation_timestamp: 2,
        owner: '0x0',
        state: AssetState.Attaking,
        pendingAttackId: undefined,
        statsLastUpdate: 0,
    });
    
    it("should decrease health by the specified percentage", () => {
        const asset = mockAsset(5, 100, AssetTypeOptions.DefenseAsset); // example asset at level 5 with 100 health
        decreaseAssetHealthByPercent(asset, 20); // decrease by 20%
        expect(asset.health).toBeLessThan(100);
    });

    it("should not reduce health below zero", () => {
        const asset = mockAsset(5, 10, AssetTypeOptions.AttackAsset);
        decreaseAssetHealthByPercent(asset, 200); // decrease by 200%
        expect(asset.health).toBe(0); // Health should not go below zero
    });

    it("should properly calculate health reduction based on max health", () => {
        const asset = mockAsset(5, 1000000, AssetTypeOptions.DefenseAsset);
        const initialHealth = asset.health;
        const percent = 50;
        const expectedReduction = Math.ceil(maxHealthAtLevel(asset.level, isFactory(asset.type)) * percent / 100);
        decreaseAssetHealthByPercent(asset, percent);

        expect(asset.health).toBe(initialHealth - expectedReduction);
    });
});


describe('maxHealthAtLevel', () => {
    test('returns correct max health for level less than 1, sets level to minimum 1', () => {
        expect(maxHealthAtLevel(0, false)).toBe(10);
        expect(maxHealthAtLevel(1, false)).toBe(10);
        expect(maxHealthAtLevel(2, false)).toBe(50);
        expect(maxHealthAtLevel(3, false)).toBe(250);

        expect(maxHealthAtLevel(0, true)).toBe(100);
        expect(maxHealthAtLevel(1, true)).toBe(100);
        expect(maxHealthAtLevel(2, true)).toBe(500);
        expect(maxHealthAtLevel(3, true)).toBe(2500);

        expect(maxHealthAtLevel(30, false)).toBe(100000000);
        expect(maxHealthAtLevel(30, true)).toBe(1000000000);
    });
});

describe('adaptPercetangeToAverage', () => {
  it('should return the adjusted percentage within the specified min and max limits', () => {
    // Test basic cases where individualValue is less than, equal to, and greater than averageValue
    expect(adaptPercetangeToAverage(100, 10, 20)).toBe(50);  // adapted = 50, within min/max
    expect(adaptPercetangeToAverage(100, 20, 20)).toBe(100); // adapted = 100, at upper limit
    expect(adaptPercetangeToAverage(100, 30, 20)).toBe(100); // adapted = 150, capped at max (100)

    // Test percent adjustment below max limit but above min
    expect(adaptPercetangeToAverage(80, 10, 20)).toBe(40);   // adapted = 40, within min/max

    // Test with minimum limit applied
    expect(adaptPercetangeToAverage(100, 5, 20)).toBe(50);   // adapted = 25, capped at min = 50

    // Test with maximum limit applied
    expect(adaptPercetangeToAverage(50, 40, 20)).toBe(100);  // adapted = 100, capped at max = 100

    // Test extreme cases with very small or large individual/average ratios
    expect(adaptPercetangeToAverage(50, 1, 100)).toBe(25);   // adapted = 0.5, capped at min = 25
    expect(adaptPercetangeToAverage(50, 100, 1)).toBe(100);  // adapted = 5000, capped at max = 100

    // Edge cases with zero values
    expect(adaptPercetangeToAverage(0, 10, 20)).toBe(0);     // Zero percent should return 0
    expect(adaptPercetangeToAverage(100, 0, 20)).toBe(50);   // Zero individual value, capped at min = 50
    expect(adaptPercetangeToAverage(100, 20, 0)).toBe(100);  // Zero average value, capped at max = 100

    // Test rounding behavior
    expect(adaptPercetangeToAverage(75, 15, 20)).toBe(56);   // adapted = 56.25, rounds to 56 within min/max

    // Boundary tests around min and max limits
    expect(adaptPercetangeToAverage(100, 50, 20)).toBe(100); // adapted = 250, capped at max = 100
    expect(adaptPercetangeToAverage(100, 1, 100)).toBe(50);  // adapted = 1, capped at min = 50
  });
});

describe("getNext2pmUTC", () => {
    it("should return 2 PM UTC of the same day if the reference time is before 2 PM UTC", () => {
        // Reference time is 10 AM UTC of January 1, 2024
        const referenceTimestamp = Date.UTC(2024, 0, 1, 10) / 1000;
        const expectedTimestamp = Date.UTC(2024, 0, 1, 14) / 1000;

        expect(getNext2pmUTC(referenceTimestamp)).toBe(expectedTimestamp);
    });

    it("should return 2 PM UTC of the next day if the reference time is at exactly 2 PM UTC", () => {
        // Reference time is exactly 2 PM UTC of January 1, 2024
        const referenceTimestamp = Date.UTC(2024, 0, 1, 14) / 1000;
        const expectedTimestamp = Date.UTC(2024, 0, 2, 14) / 1000;

        expect(getNext2pmUTC(referenceTimestamp)).toBe(expectedTimestamp);
    });

    it("should return 2 PM UTC of the next day if the reference time is after 2 PM UTC", () => {
        // Reference time is 3 PM UTC of January 1, 2024
        const referenceTimestamp = Date.UTC(2024, 0, 1, 15) / 1000;
        const expectedTimestamp = Date.UTC(2024, 0, 2, 14) / 1000;

        expect(getNext2pmUTC(referenceTimestamp)).toBe(expectedTimestamp);
    });

    it("should return 2 PM UTC of the next day if the reference time is at midnight (start of a day)", () => {
        // Reference time is midnight UTC of January 1, 2024
        const referenceTimestamp = Date.UTC(2024, 0, 1, 0) / 1000;
        const expectedTimestamp = Date.UTC(2024, 0, 1, 14) / 1000;

        expect(getNext2pmUTC(referenceTimestamp)).toBe(expectedTimestamp);
    });

    it("should return 2 PM UTC of the following day if the reference time is just before midnight (end of a day)", () => {
        // Reference time is 11:59 PM UTC of January 1, 2024
        const referenceTimestamp = Date.UTC(2024, 0, 1, 23, 59) / 1000;
        const expectedTimestamp = Date.UTC(2024, 0, 2, 14) / 1000;

        expect(getNext2pmUTC(referenceTimestamp)).toBe(expectedTimestamp);
    });
});

describe('computeReferenceTreasuryCostAtLevel', () => {
    it('should return the cost to mint character at level 1 when level is 0', () => {
        const level = 0;
        const expectedCost = costToMintCharacter(1);
        expect(computeReferenceTreasuryCostAtLevel(level)).toBe(expectedCost);
    });

    it('should return double the cost to mint character at level 1 when level is 1', () => {
        const level = 1;
        const expectedCost = 2 * costToMintCharacter(1);
        expect(computeReferenceTreasuryCostAtLevel(level)).toBe(expectedCost);
    });

    it('should return the cost to mint character at the specified level for levels > 1', () => {
        const level = 5;
        const expectedCost = costToMintCharacter(level);
        expect(computeReferenceTreasuryCostAtLevel(level)).toBe(expectedCost);
    });

    it('should handle a large level value correctly', () => {
        const level = 100;
        const expectedCost = costToMintCharacter(level);
        expect(computeReferenceTreasuryCostAtLevel(level)).toBe(expectedCost);
    });
});

describe('treasuryProdRatePerSec', () => {
    it('should return the correct production rate per second for level 0', () => {
        const level = 0;
        const expectedRate = computeReferenceTreasuryCostAtLevel(level) 
                            * constants.TREASURY_ASSETS_OF_MATCHING_LEVEL_PER_WEEK[level]
                            / constants.ONE_WEEK_IN_SECS;
        expect(treasuryProdRatePerSec(level)).toBeCloseTo(expectedRate, 5);
        expect(treasuryProdRatePerDay(level)).toBeCloseTo(treasuryProdRatePerSec(level) * 24 * 3600, 5);
        expect(treasuryProdRatePerDay(level)).toBeCloseTo(60, 5);
    });

    it('should return the correct production rate per second for level 3', () => {
        const level = 3;
        const expectedRate = computeReferenceTreasuryCostAtLevel(level) 
                            * constants.TREASURY_ASSETS_OF_MATCHING_LEVEL_PER_WEEK[level]
                            / constants.ONE_WEEK_IN_SECS;
        expect(treasuryProdRatePerSec(level)).toBeCloseTo(expectedRate, 5);
    });

    it('should handle a high level value', () => {
        const level = constants.XP_CHARACTER_PER_LEVEL.length - 1;
        const expectedRate = computeReferenceTreasuryCostAtLevel(level) 
                            * constants.TREASURY_ASSETS_OF_MATCHING_LEVEL_PER_WEEK[level]
                            / constants.ONE_WEEK_IN_SECS;
        expect(treasuryProdRatePerSec(level)).toBeCloseTo(expectedRate, 5);
    });
});
  
describe('treasuryPenaltyPerSec', () => {
    it('should return the correct penalty rate per second for level 0 and 1 asset', () => {
        const level = 0;
        const assetCount = 1;
        const expectedPenalty = computeReferenceTreasuryCostAtLevel(level)
                                * assetCount * constants.TREASURY_COST_TO_MAINTAIN_ONE_ASSET_PER_WEEK
                                / constants.ONE_WEEK_IN_SECS;
        expect(treasuryPenaltyPerSec(level, assetCount)).toBeCloseTo(expectedPenalty, 5);
    });

    it('should return the correct penalty rate per second for level 2 and 3 assets', () => {
        const level = 2;
        const assetCount = 3;
        const expectedPenalty = computeReferenceTreasuryCostAtLevel(level)
                                * assetCount * constants.TREASURY_COST_TO_MAINTAIN_ONE_ASSET_PER_WEEK
                                / constants.ONE_WEEK_IN_SECS;
        expect(treasuryPenaltyPerSec(level, assetCount)).toBeCloseTo(expectedPenalty, 5);
    });

    it('should handle high level and asset count values (level 5 and 10 assets)', () => {
        const level = 5;
        const assetCount = 10;
        const expectedPenalty = computeReferenceTreasuryCostAtLevel(level)
                                * assetCount * constants.TREASURY_COST_TO_MAINTAIN_ONE_ASSET_PER_WEEK
                                / constants.ONE_WEEK_IN_SECS;
        expect(treasuryPenaltyPerSec(level, assetCount)).toBeCloseTo(expectedPenalty, 5);
    });
});