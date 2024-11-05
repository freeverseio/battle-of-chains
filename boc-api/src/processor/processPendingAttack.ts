import murmurhash from 'murmurhash';
import { Storage, PendingState, PendingAttack } from './types';
import { addToTreasury, decreaseHealth, distanceMeter, evolveAssetsStats, evolveTreasuryByAddress, findSlowestAssetSpeed, findUser, getAlive, getAliveAndFree, getAttackingAssets, getFreeInventoryInChain, getUserTreasury, removePendingAction, setAssetsFree, subtractFromTreasury, time2travel, time2travelDistance, userDoesNotExist } from './utils'
import { DEFENSE_BOOST_HOMECHAIN, TIME_SPEED_RATIO } from './constants';

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
    const availableAttackedAssets = getAliveAndFree(attackedAssets);
    const attackedAttack = availableAttackedAssets.reduce((sum, asset) => sum + asset.attack, 0);
    const attackedDefense = availableAttackedAssets.reduce((sum, asset) => sum + asset.defense, 0) * defenseBoostHomechain;

    evolveTreasuryByAddress(attack.attacker, attack.toBeExectutedAt, storage);
    evolveTreasuryByAddress(attack.targetAddress, attack.toBeExectutedAt, storage);

    const attackerTreasury = getUserTreasury(attack.attacker, storage.users);
    const attackedTreasury = getUserTreasury(attack.targetAddress, storage.users);

    const salt = `${attack.blockHash}${storage.processedPendingIdx}${attackerTreasury}${attackedTreasury}`;
    const rnd1 =  murmurhash(salt);
    const rnd2 =  murmurhash(rnd1.toString());
    const maxHashValue = 2**32 - 1;
    const attackResult = Math.round((rnd1 * (attackerAttack - attackedDefense) - 0.5 * rnd2 * (attackedAttack - attackerDefense)) / maxHashValue);
    // result > 0 means that the attacker attacked successfuly; result < 0 means that the attacked defended successfully
    console.log(`Attacks result: ${attackResult}`);
    if (attackResult >= 0) {
        decreaseHealth(10, availableAttackedAssets);
    } else {
        decreaseHealth(10, availableAttackerAssets)
    }
    let subtractedAmount = 0;
    if (attackResult >= 0 && isTargetUserInHomechain) {
        const amount = Math.ceil(0.5 * targetUser.treasury);
        subtractedAmount = subtractFromTreasury(attack.targetAddress, attack.toBeExectutedAt, amount, storage);
        addToTreasury(attack.attacker, attack.toBeExectutedAt, subtractedAmount, storage);
    }

    setAssetsFree(attackerAssets);
    setAssetsFree(availableAttackedAssets);
    let comment = attackResult > 0 ? 'with success' : 'without success';
    if (subtractedAmount > 0) comment += `. A total of ${subtractedAmount} from the treasury was stolen in the attack.`
    storage.logs.push({
        id: storage.logs.length,
        user_address: attack.attacker,
        timestamp: attack.toBeExectutedAt,
        comment: `Your troops have attacked at ${attack.targetAddress}, ${comment}`,
    });
    storage.logs.push({
        id: storage.logs.length,
        user_address: attack.targetAddress,
        timestamp: attack.toBeExectutedAt,
        comment: `You were attacked by ${attack.attacker}, ${comment}`,
    });
}
