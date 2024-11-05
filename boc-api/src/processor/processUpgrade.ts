import { COST_PER_XP_ON_UPGRADE, XP_CHARACTER_PER_LEVEL, XP_FACTORY_PER_LEVEL } from './constants';
import { Storage, UpgradeEvent } from './types';
import { chainIsNotSupported, evolveTreasuryByAddress, getUserTreasury, isCorrectOperator, isFactory, subtractFromTreasury, userDoesNotExist } from './utils'

export function processUpgrade(event: UpgradeEvent, storage: Storage): void {
    console.log(`Processing Upgrade Event ${event.timestamp}, ${event.user}, TokenID: ${event.tokenId}, Timestamp: ${event.timestamp}`);
    if (chainIsNotSupported(event.chain, storage.chains)) return;
    if (userDoesNotExist(event.user, storage.users)) return;

    if (!isCorrectOperator(event.operator, event.user, storage.assignOperators)) {
        console.log(`WARNING: operator ${event.operator} tried a non-authorized authorized upgrade on behalf of ${event.user}`);
        return
    }

    const asset = storage.assets.find(a => a.token_id === event.tokenId && a.chain_id === event.chain && a.owner === event.user);
    if (!asset || asset.health === 0) {
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
    const neededXP = isFactory(asset.type) ? XP_FACTORY_PER_LEVEL[asset.level + 1] :  XP_CHARACTER_PER_LEVEL[asset.level + 1];
    const cost = (neededXP > currentXP) ? neededXP * COST_PER_XP_ON_UPGRADE : 0;
    const balance = getUserTreasury(event.user, storage.users);

    if (cost > balance) {
        let comment = `You tried to upgrade to level ${asset.level + 1} your asset ${event.tokenId} on chain ${event.chain}`;
        comment += `. But you have ${balance} in your treasury, and you need ${cost}.`
        storage.logs.push({
            id: storage.logs.length,
            user_address: event.user,
            timestamp: event.timestamp,
            comment: comment,
        });
        return;        
    }

    asset.xp = neededXP;
    asset.level += 1;
    subtractFromTreasury(event.user, event.timestamp, cost, storage);

    let comment = `You successfully upgraded to level ${asset.level} your asset ${event.tokenId} on chain ${event.chain}`;
    comment += `. It costed ${cost} from your treasury.`

    storage.logs.push({
        id: storage.logs.length,
        user_address: event.user,
        timestamp: event.timestamp,
        comment: comment,
    });
}
