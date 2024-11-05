import { applyNoise, level2xp, rarityToRanges, xp2level } from './utils';
import * as constants from './constants';  // Mock constants.LEVEL_XP_REQUIREMENTS
import { RangeSelection } from './types';

describe('level2xp function', () => {
    test('returns correct XP for levels within range', () => {
        expect(level2xp(0)).toBe(0);
        expect(level2xp(1)).toBe(10);
        expect(level2xp(2)).toBe(100);
    });

    test('returns the maximum XP for levels exceeding the range', () => {
        const maxXp = constants.LEVEL_XP_REQUIREMENTS[constants.LEVEL_XP_REQUIREMENTS.length - 1];
        expect(level2xp(10)).toBe(maxXp); // Levels beyond range return last XP level
        expect(level2xp(100)).toBe(maxXp);
    });

    test('returns the correct XP for the last level in the range', () => {
        const lastIndex = constants.LEVEL_XP_REQUIREMENTS.length - 1;
        expect(level2xp(lastIndex)).toBe(constants.LEVEL_XP_REQUIREMENTS[lastIndex]);
    });
});


describe('xp2level function', () => {
    test('returns correct level for XP within defined ranges', () => {
        expect(xp2level(0)).toBe(0);     // XP 0 should be level 0
        expect(xp2level(9)).toBe(0);     // XP 9 should still be level 0
        expect(xp2level(10)).toBe(1);    // XP 10 should be level 1
        expect(xp2level(99)).toBe(1);    // XP 49 should still be level 1
        expect(xp2level(100)).toBe(2);    // XP 50 should be level 2
        expect(xp2level(999)).toBe(2);    // XP 99 should still be level 2
        expect(xp2level(1000)).toBe(3);   // XP 100 should be level 3
        expect(xp2level(9999)).toBe(3);   // XP 199 should still be level 3
    });

    test('returns maximum level for XP above the highest threshold', () => {
        const maxLevel = constants.LEVEL_XP_REQUIREMENTS.length - 1;
        expect(xp2level(10000000000)).toBe(maxLevel); // XP equal to highest threshold should be max level
        expect(xp2level(10000000001)).toBe(maxLevel); // XP above highest threshold should still be max level
        expect(xp2level(20000000000)).toBe(maxLevel); // XP far above highest threshold should still be max level
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

