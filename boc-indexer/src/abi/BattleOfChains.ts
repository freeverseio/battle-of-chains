import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Attack: event("0x275ad433213dc8c15bff507f1e7f3758b0b460a5d55a44411ed2d816d90dfdc4", "Attack(uint256[],address,address,address,uint32,uint32)", {"_tokenIds": p.array(p.uint256), "_targetAddress": p.address, "_operator": indexed(p.address), "_attacker": indexed(p.address), "_targetChain": indexed(p.uint32), "_strategy": p.uint32}),
    ChainActionProposal: event("0x8747b87ceb2b2f1164eca74f645e359271ec95927021b6ff6470b000a5693f03", "ChainActionProposal(address,address,uint32,(uint32,uint8,uint8,address),string)", {"_operator": indexed(p.address), "_user": indexed(p.address), "_sourceChain": p.uint32, "_action": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address}), "_comment": p.string}),
    JoinedChain: event("0xb76888af89162640d1f93bf6507c4dffd2cee8cbccdffff114d8057a6e679b37", "JoinedChain(address,uint32,string)", {"_user": indexed(p.address), "_homeChain": indexed(p.uint32), "_nickname": p.string}),
    MultichainMint: event("0xb189b714f887ae698b140ddf7c6e07d5df979975e4675f19700ad7149a2e1ca3", "MultichainMint(uint256,address,uint256,uint32)", {"_tokenId": p.uint256, "_user": indexed(p.address), "_type": indexed(p.uint256), "_homeChain": indexed(p.uint32)}),
    RegisterMercenary: event("0x818a0e2c16a545bd1e70b4e48059d1cdde1d814eb8b722d7b44503463a4672c5", "RegisterMercenary(address,address,uint32,string)", {"_operator": p.address, "_mercenaryAddress": indexed(p.address), "_mercenaryChain": indexed(p.uint32), "_mercenaryNickname": p.string}),
    Upgrade: event("0xd306cc3329b7d7565083a73d367d13290ee47d58d01fbd8d0f5144d4ad7f0182", "Upgrade(address,address,uint32,uint256)", {"_operator": indexed(p.address), "_user": indexed(p.address), "_chain": p.uint32, "_tokenId": p.uint256}),
}

export const functions = {
    areChainActionInputsCorrect: viewFun("0xbed036b2", "areChainActionInputsCorrect(uint32,(uint32,uint8,uint8,address))", {"_homeChain": p.uint32, "_chainAction": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address})}, p.bool),
    attack: fun("0x73b5392f", "attack(uint256[],address,uint32,uint32)", {"_tokenIds": p.array(p.uint256), "_targetAddress": p.address, "_targetChain": p.uint32, "_strategy": p.uint32}, ),
    attackOnBehalfOf: fun("0xb3a4a2c0", "attackOnBehalfOf(uint256[],address,uint32,uint32,address)", {"_tokenIds": p.array(p.uint256), "_targetAddress": p.address, "_targetChain": p.uint32, "_strategy": p.uint32, "_attacker": p.address}, ),
    coordinatesOf: viewFun("0x857c467e", "coordinatesOf(address)", {"_user": p.address}, {"_x": p.uint256, "_y": p.uint256}),
    creatorFromTokenId: viewFun("0xae03420c", "creatorFromTokenId(uint256)", {"_tokenId": p.uint256}, p.address),
    hasHomeChain: viewFun("0xd908aa39", "hasHomeChain(address)", {"_user": p.address}, p.bool),
    joinHomeChain: fun("0x2a1a4115", "joinHomeChain(uint32,string)", {"_homeChain": p.uint32, "_userNickname": p.string}, ),
    multichainMint: fun("0x29273aa2", "multichainMint(uint256)", {"_type": p.uint256}, p.uint256),
    registerMercenary: fun("0x61ef0710", "registerMercenary(address,uint32,string)", {"_mercenaryAddress": p.address, "_mercenaryChain": p.uint32, "_mercenaryNickname": p.string}, ),
    tokenURI: viewFun("0xc87b56dd", "tokenURI(uint256)", {"_tokenId": p.uint256}, p.string),
    upgrade: fun("0xbbf10470", "upgrade(uint32,uint256)", {"_chain": p.uint32, "_tokenId": p.uint256}, ),
    upgradeHomebase: fun("0x1f1cd576", "upgradeHomebase()", {}, ),
    upgradeHomebaseOnBehalfOf: fun("0xec8c2270", "upgradeHomebaseOnBehalfOf(address)", {"_user": p.address}, ),
    upgradeOnBehalfOf: fun("0x74b7b3dc", "upgradeOnBehalfOf(address,uint32,uint256)", {"_user": p.address, "_chain": p.uint32, "_tokenId": p.uint256}, ),
    voteChainAction: fun("0xe1a8a8d9", "voteChainAction((uint32,uint8,uint8,address),string)", {"_chainAction": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address}), "_comment": p.string}, ),
    voteChainActionOnBehalfOf: fun("0x07c24bfa", "voteChainActionOnBehalfOf(address,(uint32,uint8,uint8,address),string)", {"_user": p.address, "_chainAction": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address}), "_comment": p.string}, ),
}

export class Contract extends ContractBase {

    areChainActionInputsCorrect(_homeChain: AreChainActionInputsCorrectParams["_homeChain"], _chainAction: AreChainActionInputsCorrectParams["_chainAction"]) {
        return this.eth_call(functions.areChainActionInputsCorrect, {_homeChain, _chainAction})
    }

    coordinatesOf(_user: CoordinatesOfParams["_user"]) {
        return this.eth_call(functions.coordinatesOf, {_user})
    }

    creatorFromTokenId(_tokenId: CreatorFromTokenIdParams["_tokenId"]) {
        return this.eth_call(functions.creatorFromTokenId, {_tokenId})
    }

    hasHomeChain(_user: HasHomeChainParams["_user"]) {
        return this.eth_call(functions.hasHomeChain, {_user})
    }

    tokenURI(_tokenId: TokenURIParams["_tokenId"]) {
        return this.eth_call(functions.tokenURI, {_tokenId})
    }
}

/// Event types
export type AttackEventArgs = EParams<typeof events.Attack>
export type ChainActionProposalEventArgs = EParams<typeof events.ChainActionProposal>
export type JoinedChainEventArgs = EParams<typeof events.JoinedChain>
export type MultichainMintEventArgs = EParams<typeof events.MultichainMint>
export type RegisterMercenaryEventArgs = EParams<typeof events.RegisterMercenary>
export type UpgradeEventArgs = EParams<typeof events.Upgrade>

/// Function types
export type AreChainActionInputsCorrectParams = FunctionArguments<typeof functions.areChainActionInputsCorrect>
export type AreChainActionInputsCorrectReturn = FunctionReturn<typeof functions.areChainActionInputsCorrect>

export type AttackParams = FunctionArguments<typeof functions.attack>
export type AttackReturn = FunctionReturn<typeof functions.attack>

export type AttackOnBehalfOfParams = FunctionArguments<typeof functions.attackOnBehalfOf>
export type AttackOnBehalfOfReturn = FunctionReturn<typeof functions.attackOnBehalfOf>

export type CoordinatesOfParams = FunctionArguments<typeof functions.coordinatesOf>
export type CoordinatesOfReturn = FunctionReturn<typeof functions.coordinatesOf>

export type CreatorFromTokenIdParams = FunctionArguments<typeof functions.creatorFromTokenId>
export type CreatorFromTokenIdReturn = FunctionReturn<typeof functions.creatorFromTokenId>

export type HasHomeChainParams = FunctionArguments<typeof functions.hasHomeChain>
export type HasHomeChainReturn = FunctionReturn<typeof functions.hasHomeChain>

export type JoinHomeChainParams = FunctionArguments<typeof functions.joinHomeChain>
export type JoinHomeChainReturn = FunctionReturn<typeof functions.joinHomeChain>

export type MultichainMintParams = FunctionArguments<typeof functions.multichainMint>
export type MultichainMintReturn = FunctionReturn<typeof functions.multichainMint>

export type RegisterMercenaryParams = FunctionArguments<typeof functions.registerMercenary>
export type RegisterMercenaryReturn = FunctionReturn<typeof functions.registerMercenary>

export type TokenURIParams = FunctionArguments<typeof functions.tokenURI>
export type TokenURIReturn = FunctionReturn<typeof functions.tokenURI>

export type UpgradeParams = FunctionArguments<typeof functions.upgrade>
export type UpgradeReturn = FunctionReturn<typeof functions.upgrade>

export type UpgradeHomebaseParams = FunctionArguments<typeof functions.upgradeHomebase>
export type UpgradeHomebaseReturn = FunctionReturn<typeof functions.upgradeHomebase>

export type UpgradeHomebaseOnBehalfOfParams = FunctionArguments<typeof functions.upgradeHomebaseOnBehalfOf>
export type UpgradeHomebaseOnBehalfOfReturn = FunctionReturn<typeof functions.upgradeHomebaseOnBehalfOf>

export type UpgradeOnBehalfOfParams = FunctionArguments<typeof functions.upgradeOnBehalfOf>
export type UpgradeOnBehalfOfReturn = FunctionReturn<typeof functions.upgradeOnBehalfOf>

export type VoteChainActionParams = FunctionArguments<typeof functions.voteChainAction>
export type VoteChainActionReturn = FunctionReturn<typeof functions.voteChainAction>

export type VoteChainActionOnBehalfOfParams = FunctionArguments<typeof functions.voteChainActionOnBehalfOf>
export type VoteChainActionOnBehalfOfReturn = FunctionReturn<typeof functions.voteChainActionOnBehalfOf>

