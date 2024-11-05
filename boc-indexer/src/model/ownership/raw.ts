export interface RawTransfer {
  id: string
  tokenId: string
  from: string
  to: string
  timestamp: Date
  blockNumber: number
  blockHash: string
  txHash: string
  logIndex: number
  ownershipContract: string
}


export interface DetectedEvents{
  transfers: RawTransfer[]
  ownershipContracts: RawOwnershipContract[]
  sendGameTreasuries: RawSendGameTreasury[]
  assignOperators: RawAssignOperator[]
}


export interface RawOwnershipContract {
  id: string
  laosContract: string | null
}

export enum GameTreasurySendMethod {
  ABSOLUTE,
  PERCENTAGE_BPS
}

export interface RawSendGameTreasury {
  id: string
  from: string
  method: GameTreasurySendMethod
  sendTXs: {
    recipient: string
    amount: string
  }[]
  timestamp: Date
  blockNumber: number
  blockHash: string
  txHash: string
  logIndex: number
}


export interface RawAssignOperator {
  id: string
  from: string
  operator: string
  timestamp: Date
  blockNumber: number
  blockHash: string
  txHash: string
  logIndex: number
}