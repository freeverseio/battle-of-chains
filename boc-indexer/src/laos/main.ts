import { TypeormDatabase, TypeormDatabaseOptions, Store } from '@subsquid/typeorm-store'
import { EntityManager } from 'typeorm'
import { processor } from './processor'
import { EventDetectionService } from './service/EventDetectionService';
import { TokenURIDataService } from './service/TokenURIDataService';
import { CustomStore } from './service/CustomStore';
import { createMintedWithExternalURIModels } from './mapper/mintMapper';
import { createTokenUriModels } from './mapper/tokenUriMapper';
import { createEvolveModels } from './mapper/evolveMapper';
import { createAttackModels } from './mapper/attackMapper';
import { createChainActionProposalModels } from './mapper/chainActionProposalMapper';
import { createJoinedChainModels } from './mapper/joinedChainMapper';
import { createMultichainMintModels } from './mapper/multichainMintMapper';
import { createUpgradeModels } from './mapper/upgradeMapper';
import { createRegisterMercenaryModels } from './mapper/registerMercenaryMapper';
import { processTokenURIs } from './tokenUriProcessor';

const options: TypeormDatabaseOptions = {
  supportHotBlocks: true,
  stateSchema: 'laos_processor',
};

processor.run<Store>(new TypeormDatabase(options) as any, async (ctx) => {
    const service = new EventDetectionService(ctx);
    const detectedEvents = service.detectEvents();
    const mintEvents = detectedEvents.mintEvents;
    const evolveEvents = detectedEvents.evolveEvents;
    const attackEvents = detectedEvents.attackEvents;
    const chainActionProposalEvents = detectedEvents.chainActionProposalEvents;
    const joinedChainEvents = detectedEvents.joinedChainEvents;
    const multichainMintEvents = detectedEvents.multichainMintEvents;
    const upgradeEvents = detectedEvents.upgradeEvents;
    const registerMercenaryEvents = detectedEvents.registerMercenaryEvents; 
    let processTokenUris = false;

  if (mintEvents.length > 0) {
    processTokenUris = true;
    const mints = createMintedWithExternalURIModels(mintEvents);
    const tokenUris = createTokenUriModels(mintEvents);
    await ctx.store.upsert(tokenUris);
    await ctx.store.upsert(mints.map(mint => mint.asset));
    await ctx.store.insert(mints.map(mint => mint.metadata));
  }

  if (evolveEvents.length > 0) {
    processTokenUris = true;
    const evolves = createEvolveModels(evolveEvents);
    const tokenUris = createTokenUriModels(evolveEvents);
    await ctx.store.upsert(tokenUris);
    const customStore = new CustomStore(ctx.store['em']());
    await customStore.evolve(evolves.map(evolve => evolve.asset));
    await ctx.store.insert(evolves.map(evolve => evolve.metadata));
  }
  if (processTokenUris) {
    processTokenURIs();
  }
  if (attackEvents.length > 0) {
      const attacks = createAttackModels(attackEvents);
      await ctx.store.upsert(attacks.map(attack => attack.attack));
  }
  if (chainActionProposalEvents.length > 0) {
    const proposals = createChainActionProposalModels(chainActionProposalEvents);
    await ctx.store.upsert(proposals.map(proposal => proposal.chainActionProposal));
  }
  
  if (joinedChainEvents.length > 0) {
    const joinedChains = createJoinedChainModels(joinedChainEvents);
    await ctx.store.upsert(joinedChains.map(joinedChain => joinedChain.joinedChain));
  }
  
  if (multichainMintEvents.length > 0) {
    const multichainMints = createMultichainMintModels(multichainMintEvents);
    await ctx.store.upsert(multichainMints.map(mint => mint.multichainMint));
  }
  
  if (upgradeEvents.length > 0) {
    const upgrades = createUpgradeModels(upgradeEvents);
    await ctx.store.upsert(upgrades.map(upgrade => upgrade.upgrade));
  }

  if (registerMercenaryEvents.length > 0) {
    const registerMercenaries = createRegisterMercenaryModels(registerMercenaryEvents);
    await ctx.store.upsert(registerMercenaries.map(mercenary => mercenary.registerMercenary));
  }

});