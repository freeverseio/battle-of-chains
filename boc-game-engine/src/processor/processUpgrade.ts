import { COST_PER_XP, XP_RATIO_COIN_FACTORY_TO_NORMAL_FACTORY } from './constants';
import { Storage, UpgradeEvent, UserType } from './types';
import { canUserAttackOrUpgradeOnChain, chainIsNotSupported, chainName, evolveTreasuryByAddress, findUser, getUserTreasury, hasHomechain, isCorrectOperator, isFactory, isUpgradeHomebase, level2xp, log2user, subtractFromTreasury, upgradeAssetToLevel } from './utils'

export function processUpgrade(event: UpgradeEvent, storage: Storage): void {
    console.log(`Processing Upgrade Event ${event.timestamp}, ${event.user}, TokenID: ${event.tokenId}, Timestamp: ${event.timestamp}`);
    if (chainIsNotSupported(event.chain, storage.chains)) return;

    const user = findUser(event.user, storage.users);
    if (!user) {
        console.log(`WARNING: An event tried to act on a user that does not exist: ${user}`);
        return;
    }

    if (!isCorrectOperator(event.operator, event.user, storage.assignOperators)) {
        console.log(`WARNING: operator ${event.operator} tried a non-authorized authorized upgrade on behalf of ${event.user}`);
        return
    }

    if (isUpgradeHomebase(event)) {
        upgradeHomebase(user, event, storage);
        return;
    }

    if (!canUserAttackOrUpgradeOnChain(user, event.chain)) {
        console.log(`WARNING: user ${event.user} cannot upgrade on chain ${event.eventChain}`);
        return;
    }

    const asset = storage.assets.find(a => a.token_id === event.tokenId && a.chain_id === event.chain && a.owner === event.user && a.health > 0);
    if (!asset) {
        log2user(
            event.user,
            `You tried to upgrade an asset on ${chainName(event.chain, storage.chains)} that either does not exist, is not alive, or that you do not own`,
            event.timestamp,
            storage.logs,
        );
        return;
    }

    evolveTreasuryByAddress(event.user, event.timestamp, storage);

    const currentXP = asset.xp;
    const nextLevelXP = level2xp(asset.level + 1, isFactory(asset.type));

    const neededXP = nextLevelXP - currentXP;
    if (neededXP < 0) {
        console.log('WARNING: An asset was to be upgraded to a level for which it already has enough XP', asset);
        return;
    }
    
    const cost = neededXP * COST_PER_XP;
    const balance = getUserTreasury(event.user, storage.users);

    if (cost > balance) {
        let comment = `You tried to upgrade to level ${asset.level + 1} your asset ${event.tokenId} on ${chainName(event.chain, storage.chains)}`;
        comment += `. The asset is still ${neededXP} XP away from next level, which costs ${cost}`
        comment += `. You only have ${balance} in your treasury.`
        log2user(event.user, comment, event.timestamp, storage.logs);
        return;        
    }

    subtractFromTreasury(event.user, event.timestamp, cost, storage);
    upgradeAssetToLevel(asset, asset.level + 1)

    let comment = `You successfully upgraded to level ${asset.level} your asset ${event.tokenId} on chain ${event.chain}`;
    comment += `. It was ${neededXP} XP away from next level; it costed ${cost} from your treasury.`
    log2user(event.user, comment, event.timestamp, storage.logs);
}

function upgradeHomebase(user: UserType, event: UpgradeEvent, storage: Storage) {
    console.log('Upgrading homebase of user', event.user);
    if (!hasHomechain(user)) {
        console.log('WARNING: user does not have an assigned homebase');
        return;
    }

    evolveTreasuryByAddress(event.user, event.timestamp, storage);

    const currentXP = user.xp;
    const nextLevelXP = XP_RATIO_COIN_FACTORY_TO_NORMAL_FACTORY * level2xp(user.level + 1, true);

    const neededXP = nextLevelXP - currentXP;
    if (neededXP < 0) {
        console.log('WARNING: A homebase was to be upgraded to a level for which it already has enough XP', user.address);
        return;
    }
    
    const cost = neededXP * COST_PER_XP;
    const balance = getUserTreasury(event.user, storage.users);

    if (cost > balance) {
        let comment = `You tried to upgrade your homebase to level ${user.level + 1}`;
        comment += `. You are still ${neededXP} XP away from next level, which costs ${cost}`
        comment += `. You only have ${balance} in your treasury.`
        log2user(event.user, comment, event.timestamp, storage.logs);
        return;
    }

    subtractFromTreasury(event.user, event.timestamp, cost, storage);
    user.level += 1;
    user.xp = nextLevelXP;

    let comment = `You successfully upgraded to level ${user.level} your homebase`;
    comment += `. It was ${neededXP} XP away from next level; it costed ${cost} from your treasury.`
    log2user(event.user, comment, event.timestamp, storage.logs);
}