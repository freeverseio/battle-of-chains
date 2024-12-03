import murmurhash from 'murmurhash';
import { Storage, PendingState, PendingAttack } from './types';
import { adaptPercetangeToAverage, addToTreasury, chainName, computeRandoms, decreaseAssetHealthByPercent, distanceMeter, evolveAssetsStats, evolveTreasuryByAddress, findSlowestAssetSpeed, findUser, getAlive, getAttackingAssets, getFreeInventoryInChain, getUserTreasury, hasHomechain, increaseAssetXPByPercent, isFactory, killHomechain, log2user, removePendingAction, reportDeath, setAssetsFree, subtractFromTreasury, time2travelDistance, userDoesNotExist } from './utils'
import { AVERAGE_POTENTIAL, DEFENSE_BOOST_HOMECHAIN, TIME_SPEED_RATIO } from './constants';

export function processPendingAttack(attack: PendingAttack, storage: Storage) {
    console.log(`ProcessPendingAttacks id = ${attack.id}`);
    if (attack.currentState === PendingState.Departing) {
        processDepartToTravel(attack, storage);
        return;
    }
    if (attack.currentState === PendingState.Travelling) {
        if (userDoesNotExist(attack.targetAddress, storage.users)) {
            log2user(
                attack.attacker,
                `Your troops arrived at ${attack.targetAddress} but found noone to attack. They're heading back`,
                attack.toBeExectutedAt,
                storage.logs
            );
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
    let comment = `Your troops on ${chainName(attack.targetChain, storage.chains)} have departed towards ${attack.targetAddress}, which is ${Math.round(distance/1000)}Km away`;
    comment += `, and will take ${Math.round(travelTime * TIME_SPEED_RATIO / 3600)} hours of game time to arrive`;
    comment += `. Since gametime is x${TIME_SPEED_RATIO} compared to real life, this amounts to ${Math.round(travelTime / 60)} min.`
    log2user(attack.attacker, comment, attack.toBeExectutedAt, storage.logs);
    attack.toBeExectutedAt += travelTime;
}

function processAttackArrival(attack: PendingAttack, storage: Storage) {
    // Attacker:
    const attackerAssets = getAttackingAssets(attack.id, storage.assets);
    evolveAssetsStats(attack.toBeExectutedAt, attackerAssets, storage);
    const availableAttackerAssets = getAlive(attackerAssets);
    if (availableAttackerAssets.length === 0) {
        const comment = `None of your assets arrived to the attack destination on ${chainName(attack.targetChain, storage.chains)}. They either died or were sold.`;
        log2user(attack.attacker, comment, attack.toBeExectutedAt, storage.logs);
        return;
    }

    const attackerAttack = availableAttackerAssets.reduce((sum, asset) => sum + asset.attack, 0);
    const attackerDefense = availableAttackerAssets.reduce((sum, asset) => sum + asset.defense, 0);
 
    // Target:
    const targetUser = findUser(attack.targetAddress, storage.users);
    const isTargetUserInHomechain = targetUser?.homechain === attack.targetChain;
    const defenseBoostHomechain = isTargetUserInHomechain ? DEFENSE_BOOST_HOMECHAIN : 1;

    const targetAssets = getFreeInventoryInChain(attack.targetAddress, attack.targetChain, storage.assets);
    evolveAssetsStats(attack.toBeExectutedAt, targetAssets, storage);
    const availableTargetAssets = getAlive(targetAssets);
    const targetAttack = availableTargetAssets.reduce((sum, asset) => sum + asset.attack, 0);
    const targetDefense = availableTargetAssets.reduce((sum, asset) => sum + asset.defense, 0) * defenseBoostHomechain;

    evolveTreasuryByAddress(attack.attacker, attack.toBeExectutedAt, storage);
    evolveTreasuryByAddress(attack.targetAddress, attack.toBeExectutedAt, storage);

    const attackerTreasury = getUserTreasury(attack.attacker, storage.users);
    const targetTreasury = getUserTreasury(attack.targetAddress, storage.users);

    const seed = murmurhash.v3(`${attack.blockHash}${storage.processedPendingIdx}${attackerTreasury}${targetTreasury}`);
    const rnds = computeRandoms(4, seed);
    const maxRndValue = 2**32 - 1;
    // one asset of level N+1 is typically STATS_FACTOR_TO_NEXT_LEVEL stronger than one asset at level N
    // We want that a 1:1 of N+1 against N makes 50% of damage
    const damageHPPercentOnTarget = Math.min(100, Math.round(50 * (rnds[0]/maxRndValue) * (attackerAttack/targetDefense)));
    const damageHPPercentOnAttacker = Math.min(100, Math.round(50 * (rnds[1]/maxRndValue) * (targetAttack/attackerDefense)));

    const increaseHPPercentForAttacker = Math.min(10, Math.round(damageHPPercentOnTarget / 5));
    const increaseHPPercentForTarget = Math.min(10, Math.round(damageHPPercentOnAttacker / 5));

    let attackerCasulaties = 0;
    let targetCasulaties = 0;


    const averageTargetDefense = targetDefense / targetAssets.length;
    for (const asset of targetAssets) {
        decreaseAssetHealthByPercent(asset, adaptPercetangeToAverage(damageHPPercentOnTarget, asset.defense, averageTargetDefense));
        if (asset.health === 0) {
            targetCasulaties++;
            reportDeath(asset, `Attack by ${attack.attacker}.`, attack.toBeExectutedAt, storage);
        } else {
            if (!isFactory(asset.type)){
                increaseAssetXPByPercent(asset, increaseHPPercentForTarget * asset.potential / AVERAGE_POTENTIAL);
            }
        }
    }

    const averageAttackerDefense = attackerDefense / attackerAssets.length;
    for (const asset of attackerAssets) {
        decreaseAssetHealthByPercent(asset, adaptPercetangeToAverage(damageHPPercentOnAttacker, asset.defense, averageAttackerDefense));
        if (asset.health === 0) {
            attackerCasulaties++;
            reportDeath(asset, `Backfire when attacking ${attack.targetAddress}.`, attack.toBeExectutedAt, storage);
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

    let attackerComment = `Your troops on ${chainName(attack.targetChain, storage.chains)} have attacked at ${attack.targetAddress}, they stole ${subtractedAmount} coins, attacked with ${damageHPPercentOnTarget}% success, and they were harmed by their backfire with ${damageHPPercentOnAttacker}% success`;
    if (increaseHPPercentForAttacker > 0) attackerComment += `. Your troops gained ${increaseHPPercentForAttacker} percentual XP points`;
    if (attackerCasulaties > 0) attackerComment += `. You lost ${attackerCasulaties} assets in the fight`;

    let targetComment = `You were attacked on ${chainName(attack.targetChain, storage.chains)} by ${attack.attacker}; they stole ${subtractedAmount} coins, and attacked you with ${damageHPPercentOnTarget}% success; you backfired and harmed them with ${damageHPPercentOnAttacker}% success`;
    if (increaseHPPercentForTarget > 0) targetComment += `. Your troops gained ${increaseHPPercentForTarget} percentual XP points`;
    if (targetCasulaties > 0) targetComment += `. You lost ${targetCasulaties} assets in the fight`;

    log2user(attack.attacker, attackerComment, attack.toBeExectutedAt, storage.logs);
    log2user(attack.targetAddress, targetComment, attack.toBeExectutedAt, storage.logs);

    // If the target user was in a homechain, and no assets were left to defend it, damage the homechain.
    if (isTargetUserInHomechain && (targetCasulaties >= availableTargetAssets.length)) {
        killHomechain(targetUser, attack.toBeExectutedAt, storage);
    }
}
