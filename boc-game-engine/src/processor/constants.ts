// Time constants
export const ONE_DAY_IN_SECS = 86400;
export const ONE_WEEK_IN_SECS = 7 * ONE_DAY_IN_SECS;
export const ONE_YEAR_IN_SECS = 365 * ONE_DAY_IN_SECS;
export const INTERVAL_BETWEEN_CHAIN_ACTIONS = ONE_DAY_IN_SECS;
export const ATTACK_TIME_TO_DEPART = 120; // in secs, how long it takes to gather troops to departs toward objective
export const HEALTH_PERCENT_IMPROVE_PER_REAL_LIFE_DAY = 15; // the % of the max health at a given level recovered by an asset, per real-life day 
export const HEALTH_PERCENT_DECREASE_PER_REAL_LIFE_DAY_AFTER_60YO = 2; // percentage lost per real-life day after turning 60 y.o.

// TIME_SPEED_RATIO: how many times the game runs faster than real life.
// - RATIO = 3600 means that 1h in the game is 1s in real life
// - RATIO = 52 means that 1year in the game is 1week in real life
export const TIME_SPEED_RATIO = 52; 

// XP and level relationship
export const XP_CHARACTER_PER_LEVEL = [0, 10, 50, 250, 1250, 6000, 30000, 150000, 750000, 4000000, 20000000, 100000000];
export const STATS_FACTOR_TO_NEXT_LEVEL = 5;
export const XP_RATIO_FACTORY_TO_CHARACTER = 10;
export const XP_RATIO_COIN_FACTORY_TO_NORMAL_FACTORY = 3;
export const XP_FACTORY_PER_LEVEL = XP_CHARACTER_PER_LEVEL.map(value => value * XP_RATIO_FACTORY_TO_CHARACTER);
export const AVERAGE_POTENTIAL = 6;

// 
export const HEALTH_INCREASE_PERCENTAGE_ON_CHAIN_IMPROVE = 25;
export const XP_INCREASE_PERCENTAGE_ON_CHAIN_IMPROVE = 20;

// Costs
export const COST_PER_XP = 1;
export const TREASURY_INIT_ALLOCATION = Math.floor(2 * XP_CHARACTER_PER_LEVEL[1] * COST_PER_XP);
export const TREASURY_ASSETS_OF_MATCHING_LEVEL_PER_WEEK = [42, 42, 28, 20, 16, 14, 10, 8, 6, 4, 2, 1];
export const TREASURY_COST_TO_MAINTAIN_ONE_ASSET_PER_WEEK = 0.5;

// Boost related
export const LEVEL_BOOST_FACTOR = 3;
export const HOMECHAIN_BOOST_FACTOR = 3;
export const DEFENSE_BOOST_HOMECHAIN = 3;
