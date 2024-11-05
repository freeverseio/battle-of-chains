export const ONE_DAY_IN_SECS = 86400;
export const TREASURY_DAILY_ASSETS_OF_MATCHING_LEVEL_PER_DAY = 5;
export const COST_OF_MINTING_ASSETS_PER_LEVEL = [0, 10,100,1000,10000,100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
export const XP_CHARACTER_PER_LEVEL = [0, 10,100,1000,10000,100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
export const TREASURY_INIT_ALLOCATION = Math.floor(0.8 * COST_OF_MINTING_ASSETS_PER_LEVEL[1]);
export const XP_FACTORY_PER_LEVEL = XP_CHARACTER_PER_LEVEL.map(value => value * 3);
export const COST_PER_XP_ON_UPGRADE = 1;
export const LEVEL_BOOST_FACTOR = 3;
export const HOMECHAIN_BOOST_FACTOR = 3;
export const LEVEL_XP_REQUIREMENTS = [0, 10,100,1000,10000,100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
export const ATTACK_TIME_TO_DEPART = 120; // in secs, how long it takes to gather troops to departs toward objective
// TIME_SPEED_RATIO: how many times the game runs faster than real life.
// - RATIO = 3600 means that 1h in the game is 1s in real life
// - RATIO = 52 means that 1year in the game is 1week in real life
export const TIME_SPEED_RATIO = 52; 
export const INTERVAL_BETWEEN_CHAIN_ACTIONS = 24*3600;
export const HEALTH_IMPROVE_PER_DAY = 1;
export const HEALTH_DECREASE_PER_DAY_AFTER_60 = 1;
export const DEFENSE_BOOST_HOMECHAIN = 3;
