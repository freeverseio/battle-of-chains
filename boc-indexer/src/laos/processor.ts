import { 
    BlockHeader, 
    DataHandlerContext, 
    EvmBatchProcessor, 
    EvmBatchProcessorFields, 
    Log as _Log, 
    Transaction as _Transaction 
} from '@subsquid/evm-processor';
import { Store } from '@subsquid/typeorm-store';
import * as EvolutionCollection from '../abi/EvolutionCollection';
import * as BattleOfChains from '../abi/BattleOfChains';

const contractAddresses = [
    process.env.BATTLE_OF_CHAINS_CONTRACT,
    process.env.BATTLE_OF_CHAINS_LAOS_COLLECTION
].filter((address): address is string => !!address).map(address => address.toLowerCase());


//Needs to be introduced all with LowerCase
export const processor = new EvmBatchProcessor()

    .setRpcEndpoint({
      url: process.env.RPC_LAOS_ENDPOINT!,
      capacity: 10,
      maxBatchCallSize: 100,
      ...(process.env.RPC_RATE_LIMIT ? { rateLimit: Number(process.env.RPC_RATE_LIMIT) } : {}),
      requestTimeout: 15_000,
    })
    .setFinalityConfirmation(6)
    .setBlockRange({
        from: Number(process.env.STARTING_BLOCK_LAOS),
    })
    .addLog({
        topic0: [
            EvolutionCollection.events.MintedWithExternalURI.topic,
            EvolutionCollection.events.EvolvedWithExternalURI.topic,
            BattleOfChains.events.Attack.topic,
            BattleOfChains.events.ChainActionProposal.topic,
            BattleOfChains.events.JoinedChain.topic,
            BattleOfChains.events.MultichainMint.topic,
            BattleOfChains.events.Upgrade.topic,
            BattleOfChains.events.RegisterMercenary.topic
        ],
        address: contractAddresses
    })
    .setFields({
        log: {
            transactionHash: true
        }
    });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
