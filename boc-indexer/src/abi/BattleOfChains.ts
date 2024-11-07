import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Attack: event("0x275ad433213dc8c15bff507f1e7f3758b0b460a5d55a44411ed2d816d90dfdc4", "Attack(uint256[],address,address,address,uint32,uint32)", {"_tokenIds": p.array(p.uint256), "_targetAddress": p.address, "_operator": indexed(p.address), "_attacker": indexed(p.address), "_targetChain": indexed(p.uint32), "_strategy": p.uint32}),
    ChainActionProposal: event("0x8747b87ceb2b2f1164eca74f645e359271ec95927021b6ff6470b000a5693f03", "ChainActionProposal(address,address,uint32,(uint32,uint8,uint8,address),string)", {"_operator": indexed(p.address), "_user": indexed(p.address), "_sourceChain": p.uint32, "_action": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address}), "_comment": p.string}),
    JoinedChain: event("0xb76888af89162640d1f93bf6507c4dffd2cee8cbccdffff114d8057a6e679b37", "JoinedChain(address,uint32,string)", {"_user": indexed(p.address), "_homeChain": indexed(p.uint32), "_nickname": p.string}),
    MultichainMint: event("0xb189b714f887ae698b140ddf7c6e07d5df979975e4675f19700ad7149a2e1ca3", "MultichainMint(uint256,address,uint256,uint32)", {"_tokenId": p.uint256, "_user": indexed(p.address), "_type": indexed(p.uint256), "_homeChain": indexed(p.uint32)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    RegisterMercenary: event("0x049b122bdeb72db61d323fd64720bbf17f476f6ec8ea9d994b3d0b9adb96df16", "RegisterMercenary(address,uint32,string)", {"_mercenaryAddress": indexed(p.address), "_mercenaryChain": indexed(p.uint32), "_mercenaryNickname": p.string}),
    Upgrade: event("0xd306cc3329b7d7565083a73d367d13290ee47d58d01fbd8d0f5144d4ad7f0182", "Upgrade(address,address,uint32,uint256)", {"_operator": indexed(p.address), "_user": indexed(p.address), "_chain": p.uint32, "_tokenId": p.uint256}),
}

export const functions = {
    addSupportedContract: fun("0x8981f942", "addSupportedContract(uint32,address,string)", {"_chain": p.uint32, "_contractAddress": p.address, "_observations": p.string}, ),
    addTokenURIs: fun("0x3685972a", "addTokenURIs(string[])", {"_tokenURIs": p.array(p.string)}, ),
    allSupportedContracts: viewFun("0x85c95d01", "allSupportedContracts()", {}, p.array(p.struct({"chain": p.uint32, "contractAddress": p.address, "observations": p.string}))),
    areChainActionInputsCorrect: viewFun("0xbed036b2", "areChainActionInputsCorrect(uint32,(uint32,uint8,uint8,address))", {"_sourceChain": p.uint32, "_chainAction": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address})}, p.bool),
    attack: fun("0x73b5392f", "attack(uint256[],address,uint32,uint32)", {"_tokenIds": p.array(p.uint256), "_targetAddress": p.address, "_targetChain": p.uint32, "_strategy": p.uint32}, ),
    attackOnBehalfOf: fun("0xb3a4a2c0", "attackOnBehalfOf(uint256[],address,uint32,uint32,address)", {"_tokenIds": p.array(p.uint256), "_targetAddress": p.address, "_targetChain": p.uint32, "_strategy": p.uint32, "_attacker": p.address}, ),
    changeTokenURIs: fun("0xba0ce415", "changeTokenURIs(uint256[],string[])", {"_types": p.array(p.uint256), "_tokenURIs": p.array(p.string)}, ),
    collectionContract: viewFun("0x709263c1", "collectionContract()", {}, p.address),
    coordinatesOf: viewFun("0x857c467e", "coordinatesOf(address)", {"_user": p.address}, {"_x": p.uint256, "_y": p.uint256}),
    creatorFromTokenId: viewFun("0xae03420c", "creatorFromTokenId(uint256)", {"_tokenId": p.uint256}, p.address),
    hasHomeChain: viewFun("0xd908aa39", "hasHomeChain(address)", {"_user": p.address}, p.bool),
    homeChainOf: viewFun("0x81d1d524", "homeChainOf(address)", {"user": p.address}, p.uint32),
    isTypeDefined: viewFun("0x8941cf5d", "isTypeDefined(uint256)", {"_type": p.uint256}, p.bool),
    joinHomeChain: fun("0x2a1a4115", "joinHomeChain(uint32,string)", {"_homeChain": p.uint32, "_userNickname": p.string}, ),
    multichainMint: fun("0x29273aa2", "multichainMint(uint256)", {"_type": p.uint256}, p.uint256),
    nDefinedTypes: viewFun("0x5b3967a3", "nDefinedTypes()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    registerMercenary: fun("0x61ef0710", "registerMercenary(address,uint32,string)", {"_mercenaryAddress": p.address, "_mercenaryChain": p.uint32, "_mercenaryNickname": p.string}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    setSupportedContractsManager: fun("0x9ef46029", "setSupportedContractsManager(address)", {"_newManager": p.address}, ),
    setURIManager: fun("0x198b474a", "setURIManager(address)", {"_newManager": p.address}, ),
    supportedContracts: viewFun("0x30864028", "supportedContracts(uint256)", {"_0": p.uint256}, {"chain": p.uint32, "contractAddress": p.address, "observations": p.string}),
    supportedContractsManager: viewFun("0x03f5e230", "supportedContractsManager()", {}, p.address),
    tokenURI: viewFun("0xc87b56dd", "tokenURI(uint256)", {"_tokenId": p.uint256}, p.string),
    tokenURIForType: viewFun("0x556adc4e", "tokenURIForType(uint256)", {"_0": p.uint256}, p.string),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    upgrade: fun("0xbbf10470", "upgrade(uint32,uint256)", {"_chain": p.uint32, "_tokenId": p.uint256}, ),
    upgradeHomebase: fun("0x1f1cd576", "upgradeHomebase()", {}, ),
    upgradeHomebaseOnBehalfOf: fun("0xec8c2270", "upgradeHomebaseOnBehalfOf(address)", {"_user": p.address}, ),
    upgradeOnBehalfOf: fun("0x74b7b3dc", "upgradeOnBehalfOf(address,uint32,uint256)", {"_user": p.address, "_chain": p.uint32, "_tokenId": p.uint256}, ),
    uriManager: viewFun("0x7aef2f32", "uriManager()", {}, p.address),
    voteChainAction: fun("0xe1a8a8d9", "voteChainAction((uint32,uint8,uint8,address),string)", {"_chainAction": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address}), "_comment": p.string}, ),
    voteChainActionOnBehalfOf: fun("0x07c24bfa", "voteChainActionOnBehalfOf(address,(uint32,uint8,uint8,address),string)", {"_user": p.address, "_chainAction": p.struct({"targetChain": p.uint32, "actionType": p.uint8, "attackArea": p.uint8, "attackAddress": p.address}), "_comment": p.string}, ),
}

export class Contract extends ContractBase {

    allSupportedContracts() {
        return this.eth_call(functions.allSupportedContracts, {})
    }

    areChainActionInputsCorrect(_sourceChain: AreChainActionInputsCorrectParams["_sourceChain"], _chainAction: AreChainActionInputsCorrectParams["_chainAction"]) {
        return this.eth_call(functions.areChainActionInputsCorrect, {_sourceChain, _chainAction})
    }

    collectionContract() {
        return this.eth_call(functions.collectionContract, {})
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

    homeChainOf(user: HomeChainOfParams["user"]) {
        return this.eth_call(functions.homeChainOf, {user})
    }

    isTypeDefined(_type: IsTypeDefinedParams["_type"]) {
        return this.eth_call(functions.isTypeDefined, {_type})
    }

    nDefinedTypes() {
        return this.eth_call(functions.nDefinedTypes, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    supportedContracts(_0: SupportedContractsParams["_0"]) {
        return this.eth_call(functions.supportedContracts, {_0})
    }

    supportedContractsManager() {
        return this.eth_call(functions.supportedContractsManager, {})
    }

    tokenURI(_tokenId: TokenURIParams["_tokenId"]) {
        return this.eth_call(functions.tokenURI, {_tokenId})
    }

    tokenURIForType(_0: TokenURIForTypeParams["_0"]) {
        return this.eth_call(functions.tokenURIForType, {_0})
    }

    uriManager() {
        return this.eth_call(functions.uriManager, {})
    }
}

/// Event types
export type AttackEventArgs = EParams<typeof events.Attack>
export type ChainActionProposalEventArgs = EParams<typeof events.ChainActionProposal>
export type JoinedChainEventArgs = EParams<typeof events.JoinedChain>
export type MultichainMintEventArgs = EParams<typeof events.MultichainMint>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type RegisterMercenaryEventArgs = EParams<typeof events.RegisterMercenary>
export type UpgradeEventArgs = EParams<typeof events.Upgrade>

/// Function types
export type AddSupportedContractParams = FunctionArguments<typeof functions.addSupportedContract>
export type AddSupportedContractReturn = FunctionReturn<typeof functions.addSupportedContract>

export type AddTokenURIsParams = FunctionArguments<typeof functions.addTokenURIs>
export type AddTokenURIsReturn = FunctionReturn<typeof functions.addTokenURIs>

export type AllSupportedContractsParams = FunctionArguments<typeof functions.allSupportedContracts>
export type AllSupportedContractsReturn = FunctionReturn<typeof functions.allSupportedContracts>

export type AreChainActionInputsCorrectParams = FunctionArguments<typeof functions.areChainActionInputsCorrect>
export type AreChainActionInputsCorrectReturn = FunctionReturn<typeof functions.areChainActionInputsCorrect>

export type AttackParams = FunctionArguments<typeof functions.attack>
export type AttackReturn = FunctionReturn<typeof functions.attack>

export type AttackOnBehalfOfParams = FunctionArguments<typeof functions.attackOnBehalfOf>
export type AttackOnBehalfOfReturn = FunctionReturn<typeof functions.attackOnBehalfOf>

export type ChangeTokenURIsParams = FunctionArguments<typeof functions.changeTokenURIs>
export type ChangeTokenURIsReturn = FunctionReturn<typeof functions.changeTokenURIs>

export type CollectionContractParams = FunctionArguments<typeof functions.collectionContract>
export type CollectionContractReturn = FunctionReturn<typeof functions.collectionContract>

export type CoordinatesOfParams = FunctionArguments<typeof functions.coordinatesOf>
export type CoordinatesOfReturn = FunctionReturn<typeof functions.coordinatesOf>

export type CreatorFromTokenIdParams = FunctionArguments<typeof functions.creatorFromTokenId>
export type CreatorFromTokenIdReturn = FunctionReturn<typeof functions.creatorFromTokenId>

export type HasHomeChainParams = FunctionArguments<typeof functions.hasHomeChain>
export type HasHomeChainReturn = FunctionReturn<typeof functions.hasHomeChain>

export type HomeChainOfParams = FunctionArguments<typeof functions.homeChainOf>
export type HomeChainOfReturn = FunctionReturn<typeof functions.homeChainOf>

export type IsTypeDefinedParams = FunctionArguments<typeof functions.isTypeDefined>
export type IsTypeDefinedReturn = FunctionReturn<typeof functions.isTypeDefined>

export type JoinHomeChainParams = FunctionArguments<typeof functions.joinHomeChain>
export type JoinHomeChainReturn = FunctionReturn<typeof functions.joinHomeChain>

export type MultichainMintParams = FunctionArguments<typeof functions.multichainMint>
export type MultichainMintReturn = FunctionReturn<typeof functions.multichainMint>

export type NDefinedTypesParams = FunctionArguments<typeof functions.nDefinedTypes>
export type NDefinedTypesReturn = FunctionReturn<typeof functions.nDefinedTypes>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RegisterMercenaryParams = FunctionArguments<typeof functions.registerMercenary>
export type RegisterMercenaryReturn = FunctionReturn<typeof functions.registerMercenary>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SetSupportedContractsManagerParams = FunctionArguments<typeof functions.setSupportedContractsManager>
export type SetSupportedContractsManagerReturn = FunctionReturn<typeof functions.setSupportedContractsManager>

export type SetURIManagerParams = FunctionArguments<typeof functions.setURIManager>
export type SetURIManagerReturn = FunctionReturn<typeof functions.setURIManager>

export type SupportedContractsParams = FunctionArguments<typeof functions.supportedContracts>
export type SupportedContractsReturn = FunctionReturn<typeof functions.supportedContracts>

export type SupportedContractsManagerParams = FunctionArguments<typeof functions.supportedContractsManager>
export type SupportedContractsManagerReturn = FunctionReturn<typeof functions.supportedContractsManager>

export type TokenURIParams = FunctionArguments<typeof functions.tokenURI>
export type TokenURIReturn = FunctionReturn<typeof functions.tokenURI>

export type TokenURIForTypeParams = FunctionArguments<typeof functions.tokenURIForType>
export type TokenURIForTypeReturn = FunctionReturn<typeof functions.tokenURIForType>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpgradeParams = FunctionArguments<typeof functions.upgrade>
export type UpgradeReturn = FunctionReturn<typeof functions.upgrade>

export type UpgradeHomebaseParams = FunctionArguments<typeof functions.upgradeHomebase>
export type UpgradeHomebaseReturn = FunctionReturn<typeof functions.upgradeHomebase>

export type UpgradeHomebaseOnBehalfOfParams = FunctionArguments<typeof functions.upgradeHomebaseOnBehalfOf>
export type UpgradeHomebaseOnBehalfOfReturn = FunctionReturn<typeof functions.upgradeHomebaseOnBehalfOf>

export type UpgradeOnBehalfOfParams = FunctionArguments<typeof functions.upgradeOnBehalfOf>
export type UpgradeOnBehalfOfReturn = FunctionReturn<typeof functions.upgradeOnBehalfOf>

export type UriManagerParams = FunctionArguments<typeof functions.uriManager>
export type UriManagerReturn = FunctionReturn<typeof functions.uriManager>

export type VoteChainActionParams = FunctionArguments<typeof functions.voteChainAction>
export type VoteChainActionReturn = FunctionReturn<typeof functions.voteChainAction>

export type VoteChainActionOnBehalfOfParams = FunctionArguments<typeof functions.voteChainActionOnBehalfOf>
export type VoteChainActionOnBehalfOfReturn = FunctionReturn<typeof functions.voteChainActionOnBehalfOf>

