import murmurhash from 'murmurhash';
import { Storage, PendingState, PendingAttack } from './types';
import { adaptPercetangeToAverage, addToTreasury, computeRandoms, decreaseAssetHealthByPercent, distanceMeter, evolveAssetsStats, evolveTreasuryByAddress, findSlowestAssetSpeed, findUser, getAlive, getAliveAndFree, getAttackingAssets, getFreeInventoryInChain, getUserTreasury, increaseAssetXPByPercent, isFactory, removePendingAction, setAssetsFree, subtractFromTreasury, time2travelDistance, userDoesNotExist } from './utils'
import { AVERAGE_POTENTIAL, DEFENSE_BOOST_HOMECHAIN, TIME_SPEED_RATIO } from './constants';

export function processPendingAttack(attack: PendingAttack, storage: Storage) {
    console.log(`ProcessPendingAttacks id = ${attack.id}`);
    if (attack.currentState === PendingState.Departing) {
        processDepartToTravel(attack, storage);
        return;
    }
    if (attack.currentState === PendingState.Travelling) {
        if (userDoesNotExist(attack.targetAddress, storage.users)) {
            storage.logs.push({
                id: storage.logs.length,
                user_address: attack.attacker,
                timestamp: attack.toBeExectutedAt,
                comment: `Your troops arrived at ${attack.targetAddress} but found noone to attack. They're heading back`,
            });
        } else {
            processAttackArrival(attack, storage);
        }
        removePendingAction(attack.id, storage.pendingActions);
    }
}

function processDepartToTravel(attack: PendingAttack, storage: Storage) {
    attack.currentState = PendingState.Travelling;
    const distance = distanceMeter(attack.attacker, attack.targetAddress);
    const travelTime = time2travelDistance(distance, findSlowestAssetSpeed(attack.id, storage.assets));
    attack.toBeExectutedAt += travelTime;
    let comment = `Your troops have departed towards ${attack.targetAddress}, which is ${Math.round(distance/1000)}Km away`;
    comment += `, and will take ${Math.round(travelTime * TIME_SPEED_RATIO / 3600)} hours of game time to arrive`;
    comment += `. Since gametime is x${TIME_SPEED_RATIO} compared to real life, this amounts to ${Math.round(travelTime / 60)} min.`

    storage.logs.push({
        id: storage.logs.length,
        user_address: attack.attacker,
        timestamp: attack.toBeExectutedAt,
        comment: comment,
    });
}

function processAttackArrival(attack: PendingAttack, storage: Storage) {
    // Attacker:
    const attackerAssets = getAttackingAssets(attack.id, storage.assets);
    evolveAssetsStats(attack.toBeExectutedAt, attackerAssets);
    const availableAttackerAssets = getAlive(attackerAssets);
    const attackerAttack = availableAttackerAssets.reduce((sum, asset) => sum + asset.attack, 0);
    const attackerDefense = availableAttackerAssets.reduce((sum, asset) => sum + asset.defense, 0);

    // Attacked:
    const targetUser = findUser(attack.targetAddress, storage.users);
    const isTargetUserInHomechain = targetUser?.homechain === attack.targetChain;
    const defenseBoostHomechain = isTargetUserInHomechain ? DEFENSE_BOOST_HOMECHAIN : 1;

    const attackedAssets = getFreeInventoryInChain(attack.targetAddress, attack.targetChain, storage.assets);
    evolveAssetsStats(attack.toBeExectutedAt, attackedAssets);
    const availableAttackedAssets = getAlive(attackedAssets);
    const attackedAttack = availableAttackedAssets.reduce((sum, asset) => sum + asset.attack, 0);
    const attackedDefense = availableAttackedAssets.reduce((sum, asset) => sum + asset.defense, 0) * defenseBoostHomechain;

    evolveTreasuryByAddress(attack.attacker, attack.toBeExectutedAt, storage);
    evolveTreasuryByAddress(attack.targetAddress, attack.toBeExectutedAt, storage);

    const attackerTreasury = getUserTreasury(attack.attacker, storage.users);
    const attackedTreasury = getUserTreasury(attack.targetAddress, storage.users);

    const seed = murmurhash.v3(`${attack.blockHash}${storage.processedPendingIdx}${attackerTreasury}${attackedTreasury}`);
    const rnds = computeRandoms(4, seed);
    const maxRndValue = 2**32 - 1;
    // one asset of level N+1 is typically STATS_FACTOR_TO_NEXT_LEVEL stronger than one asset at level N
    // We want that a 1:1 of N+1 against N makes 50% of damage
    const damageHPPercentOnTarget =  Math.min(100, Math.round(50 * (rnds[0]/maxRndValue) * (attackerAttack/attackedDefense)));
    const damageHPPercentOnAttacker = Math.min(100, Math.round(50 * (rnds[1]/maxRndValue) * (attackedAttack/attackerDefense)));

    const increaseHPPercentForAttacker = Math.min(10, Math.round(damageHPPercentOnTarget / 5));
    const increaseHPPercentForAttacked = Math.min(10, Math.round(damageHPPercentOnAttacker / 5));

    let attackerCasulaties = 0;
    let attackedCasulaties = 0;


    const averageAttackedDefense = attackedDefense / attackedAssets.length;
    for (let asset of attackedAssets) {
        decreaseAssetHealthByPercent(asset, adaptPercetangeToAverage(damageHPPercentOnTarget, asset.defense, averageAttackedDefense));
        if (asset.health === 0) {
            attackedCasulaties++;
        } else {
            if (!isFactory(asset.type)){
                increaseAssetXPByPercent(asset, increaseHPPercentForAttacked * asset.potential / AVERAGE_POTENTIAL);
            }
        }
    }

    const averageAttackerDefense = attackerDefense / attackerAssets.length;
    for (let asset of attackerAssets) {
        decreaseAssetHealthByPercent(asset, adaptPercetangeToAverage(damageHPPercentOnAttacker, asset.defense, averageAttackerDefense));
        if (asset.health === 0) {
            attackerCasulaties++;
        } else { 
            if (!isFactory(asset.type)) {
                increaseAssetXPByPercent(asset, increaseHPPercentForAttacker * asset.potential / AVERAGE_POTENTIAL);
            }
        }
    }

    let subtractedAmount = 0;
    if (damageHPPercentOnTarget >= 0 && isTargetUserInHomechain) {
        const amount = Math.ceil(damageHPPercentOnTarget / 100 * targetUser.treasury);
        subtractedAmount = subtractFromTreasury(attack.targetAddress, attack.toBeExectutedAt, amount, storage);
        addToTreasury(attack.attacker, attack.toBeExectutedAt, subtractedAmount, storage);
    }

    setAssetsFree(attackerAssets);
    setAssetsFree(availableAttackedAssets);

    let attackerComment = `Your troops have attacked at ${attack.targetAddress}, they stole ${subtractedAmount} coins, attacked with ${damageHPPercentOnTarget}% success, and they were harmed by their backfire with ${damageHPPercentOnAttacker}% success`;
    if (increaseHPPercentForAttacker > 0) attackerComment += `. Your troops gained ${increaseHPPercentForAttacker} percentual XP points`;
    if (attackerCasulaties > 0) attackerComment += `. You lost ${attackerCasulaties} assets in the fight`;

    let attackedComment = `You were attacked by ${attack.attacker}; they stole ${subtractedAmount} coins, and attacked you with ${damageHPPercentOnTarget}% success; you backfired and harmed them with ${damageHPPercentOnAttacker}% success`;
    if (increaseHPPercentForAttacked > 0) attackedComment += `. Your troops gained ${increaseHPPercentForAttacked} percentual XP points`;
    if (attackedCasulaties > 0) attackedComment += `. You lost ${attackedCasulaties} assets in the fight`;

    storage.logs.push({
        id: storage.logs.length,
        user_address: attack.attacker,
        timestamp: attack.toBeExectutedAt,
        comment: attackerComment,
    });
    storage.logs.push({
        id: storage.logs.length,
        user_address: attack.targetAddress,
        timestamp: attack.toBeExectutedAt,
        comment: attackedComment,
    });
}
