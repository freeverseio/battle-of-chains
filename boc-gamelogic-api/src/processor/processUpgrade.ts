import { COST_PER_XP, XP_RATIO_COIN_FACTORY_TO_NORMAL_FACTORY } from './constants';
import { Storage, UpgradeEvent } from './types';
import { chainIsNotSupported, evolveTreasuryByAddress, findUser, getUserTreasury, isCorrectOperator, isFactory, isUpgradeHomebase, level2xp, subtractFromTreasury, upgradeAssetToLevel, userDoesNotExist } from './utils'

export function processUpgrade(event: UpgradeEvent, storage: Storage): void {
    console.log(`Processing Upgrade Event ${event.timestamp}, ${event.user}, TokenID: ${event.tokenId}, Timestamp: ${event.timestamp}`);
    if (chainIsNotSupported(event.chain, storage.chains)) return;
    if (userDoesNotExist(event.user, storage.users)) return;

    if (!isCorrectOperator(event.operator, event.user, storage.assignOperators)) {
        console.log(`WARNING: operator ${event.operator} tried a non-authorized authorized upgrade on behalf of ${event.user}`);
        return
    }

    if (isUpgradeHomebase(event)) {
        upgradeHomebase(event, storage);
        return;
    }

    const asset = storage.assets.find(a => a.token_id === event.tokenId && a.chain_id === event.chain && a.owner === event.user && a.health > 0);
    if (!asset) {
        storage.logs.push({
            id: storage.logs.length,
            user_address: event.user,
            timestamp: event.timestamp,
            comment: `You tried to upgrade an asset in chain ${event.chain} that either does not exist, is not alive, or that you do not own`,
        });
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
        let comment = `You tried to upgrade to level ${asset.level + 1} your asset ${event.tokenId} on chain ${event.chain}`;
        comment += `. The asset is still ${neededXP} XP away from next level, which costs ${cost}`
        comment += `. You only have ${balance} in your treasury.`
        storage.logs.push({
            id: storage.logs.length,
            user_address: event.user,
            timestamp: event.timestamp,
            comment: comment,
        });
        return;        
    }

    subtractFromTreasury(event.user, event.timestamp, cost, storage);
    upgradeAssetToLevel(asset, asset.level + 1)

    let comment = `You successfully upgraded to level ${asset.level} your asset ${event.tokenId} on chain ${event.chain}`;
    comment += `. It was ${neededXP} XP away from next level; it costed ${cost} from your treasury.`

    storage.logs.push({
        id: storage.logs.length,
        user_address: event.user,
        timestamp: event.timestamp,
        comment: comment,
    });
}

function upgradeHomebase(event: UpgradeEvent, storage: Storage) {
    console.log('Upgrading homebase of user', event.user);
    const user = findUser(event.user, storage.users);
    if (!user) {
        console.log('WARNING: homebase upgrade called for a user that was not found');
        return;
    }
    if (!user.homechain) {
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
        storage.logs.push({
            id: storage.logs.length,
            user_address: event.user,
            timestamp: event.timestamp,
            comment: comment,
        });
        return;        
    }

    subtractFromTreasury(event.user, event.timestamp, cost, storage);
    user.level += 1;
    user.xp = nextLevelXP;

    let comment = `You successfully upgraded to level ${user.level} your homebase`;
    comment += `. It was ${neededXP} XP away from next level; it costed ${cost} from your treasury.`

    storage.logs.push({
        id: storage.logs.length,
        user_address: event.user,
        timestamp: event.timestamp,
        comment: comment,
    });
}