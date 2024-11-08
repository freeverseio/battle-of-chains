import { ATTACK_TIME_TO_DEPART } from './constants';
import { Storage, AttackEvent, PendingState, AssetState, PendingActionOption } from './types';
import { canUserAttackOnChain, evolveTreasuryByAddress, findUser, getAllAssetsThatCanPrepareForAttack, getAllAssetsThatCanPrepareForAttackAmong, isCorrectOperator, userDoesNotExist } from './utils';


export function processAttack(event: AttackEvent, storage: Storage): void {
    console.log(`Processing Attack Event ${event.timestamp}, Attacker: ${event.attacker}, Target: ${event.targetAddress}, Timestamp: ${event.timestamp} on chain ${event.eventChain}`);
    
    const attacker = findUser(event.attacker, storage.users);
    if (!attacker) {
        console.log('WARNING: Someone tried to perform an attack on behalf of a non existing user ', event.attacker);
        return;
    }

    if (!isCorrectOperator(event.operator, event.attacker, storage.assignOperators)) {
        console.log(`WARNING: operator ${event.operator} tried a non-authorized authorized attack on behalf of ${event.attacker}`);
        return
    }

    if (!canUserAttackOnChain(attacker, event.targetChain)) {
        console.log(`WARNING: user ${event.attacker} cannot attack on chain ${event.targetChain}`);
        return;
    }

    const availableAssets = (event.tokenIds.length === 0) ?
        getAllAssetsThatCanPrepareForAttack(event.attacker, event.targetChain, storage.assets) :
        getAllAssetsThatCanPrepareForAttackAmong(event.attacker, event.targetChain, storage.assets, event.tokenIds);

    if (availableAssets.length == 0) {
        storage.logs.push({
            id: storage.logs.length,
            user_address: event.attacker,
            timestamp: event.timestamp,
            comment: `You tried to attack ${event.attacker} on chain ${event.eventChain}, but you do not have available assets in that chain.`,
        });
        return
    }

    const pendingAttackId = storage.processedPendingIdx;
    for (let a of availableAssets) {
        a.state = AssetState.Attaking;  
        a.pendingAttackId = pendingAttackId;  
    }

    evolveTreasuryByAddress(event.attacker, event.timestamp, storage);
    const toBeExectutedAt = event.timestamp + ATTACK_TIME_TO_DEPART;

    storage.pendingActions.push({
        id: pendingAttackId,
        currentState: PendingState.Departing,
        toBeExectutedAt: toBeExectutedAt,
        targetAddress: event.targetAddress,
        attacker: event.attacker,
        targetChain: event.targetChain,
        strategy: event.strategy,
        blockHash: event.blockHash,
        type: PendingActionOption.Attack,
    });
    storage.processedPendingIdx += 1;

    storage.logs.push({
        id: storage.logs.length,
        user_address: event.attacker,
        timestamp: event.timestamp,
        comment: `Your troops are getting ready to depart towards ${event.targetAddress}. They will depart at ${toBeExectutedAt}`,
    });

    if (userDoesNotExist(event.targetAddress, storage.users)) {
        console.log('WARNING: An attack will likely hit an empty location', event.targetAddress);
        return;
    }
    evolveTreasuryByAddress(event.targetAddress, event.timestamp, storage);
    storage.logs.push({
        id: storage.logs.length,
        user_address: event.targetAddress,
        timestamp: event.timestamp,
        comment: `Troops by user ${event.attacker} are getting ready to travel towards your location to attack. They will depart at ${toBeExectutedAt}`,
    });
}
