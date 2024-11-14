import {  EventType, AllEventTypes } from "./types";

import * as dotenv from "dotenv";
dotenv.config({ path: '../docker/.env' });

const LAOS_CHAIN_ID = process.env.LAOS_CHAIN_ID ? Number(process.env.LAOS_CHAIN_ID) : 6283;
const LAOS_GRAPHQL = process.env.LAOS_GRAPHQL ? process.env.LAOS_GRAPHQL : '';
const OWNERSHIP_GRAPHQLS = process.env.OWNERSHIP_GRAPHQLS ? process.env.OWNERSHIP_GRAPHQLS.split(',') : [];


async function fetchGraphQL(endpoint: string, query: string, variables: any = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }
  return result.data;
}

function enrichEvents<T>(events: AllEventTypes[], eventChain: number, eventType: EventType): AllEventTypes[] {
  return events.map(event => ({
    ...event,
    timestamp: Math.floor(new Date(event.timestamp).getTime() / 1000),
    eventChain,
    eventType,
  }));
}

export async function getJoinedChainEventsInBatch(limit: number, offset: number): Promise<AllEventTypes[]> {
  const query = `
    query {
      joinedChains(limit: ${limit}, offset: ${offset}) {
        user
        homeChain
        nickname
        timestamp
        blockNumber
        blockHash
        txHash
        logIndex
      }
    }
  `;

  const data = await fetchGraphQL(LAOS_GRAPHQL, query);
  return enrichEvents(data.joinedChains, LAOS_CHAIN_ID, EventType.JoinedChainEvent);
}

export async function getMultichainMintEventsInBatch(limit: number, offset: number): Promise<AllEventTypes[]> {
  const query = `
    query {
      multichainMints(limit: ${limit}, offset: ${offset}) {
        tokenId
        user
        typeId
        homeChain
        timestamp
        blockNumber
        blockHash
        txHash
        logIndex
      }
    }
  `;
  const data = await fetchGraphQL(LAOS_GRAPHQL, query);
  return enrichEvents(data.multichainMints, LAOS_CHAIN_ID, EventType.MultichainMintEvent);
}

export async function getAttackEventsInBatch(limit: number, offset: number): Promise<AllEventTypes[]> {
  const query = `
    query {
      attacks(limit: ${limit}, offset: ${offset}) {
        tokenIds
        targetAddress
        operator
        attacker
        targetChain
        strategy
        timestamp
        blockNumber
        blockHash
        txHash
        logIndex
      }
    }
  `;
  const data = await fetchGraphQL(LAOS_GRAPHQL, query);
  return enrichEvents(data.attacks, LAOS_CHAIN_ID, EventType.AttackEvent);
}

export async function getChainActionProposalEventsInBatch(limit: number, offset: number): Promise<AllEventTypes[]> {
  const query = `
    query {
      chainActionProposals(limit: ${limit}, offset: ${offset}) {
        operator
        user
        sourceChain
        targetChain
        actionType
        attackArea
        attackAddress
        comment
        timestamp
        blockNumber
        blockHash
        txHash
        logIndex
      }
    }
  `;

  const data = await fetchGraphQL(LAOS_GRAPHQL, query);
  return enrichEvents(data.chainActionProposals, LAOS_CHAIN_ID, EventType.ChainActionProposalEvent);
}

export async function getUpgradeEventsInBatch(limit: number, offset: number): Promise<AllEventTypes[]> {
  const query = `
    query {
      upgrades(limit: ${limit}, offset: ${offset}) {
        operator
        user
        chain
        tokenId
        timestamp
        blockNumber
        blockHash
        txHash
        logIndex
      }
    }
  `;

  const data = await fetchGraphQL(LAOS_GRAPHQL, query);
  return enrichEvents(data.upgrades, LAOS_CHAIN_ID, EventType.UpgradeEvent);
}

export async function getAssignOperatorEvents(chainIdx: number, chain_id: number): Promise<AllEventTypes[]> {
  const query = `
    query {
      assignOperators {
        operator
        from
        timestamp
        blockNumber
        logIndex
      }
    }
  `;
  const data = await fetchGraphQL(OWNERSHIP_GRAPHQLS[chainIdx], query);
  return enrichEvents(data.assignOperators, chain_id, EventType.AssignOperatorEvent);
}

export async function getTransferEvents(chainIdx: number, chain_id: number): Promise<AllEventTypes[]> {
  const query = `
    query {
      transfers {
        from
        to
        tokenId
        blockNumber
        logIndex
        timestamp
      }
    }
  `;
  const data = await fetchGraphQL(OWNERSHIP_GRAPHQLS[chainIdx], query);
  return enrichEvents(data.transfers, chain_id, EventType.TransferEvent);
}

export async function getRegisterMercenaryEvents(): Promise<AllEventTypes[]> {
  const query = `
    query {
      registerMercenaries {
        mercenaryAddress
        mercenaryChain
        mercenaryNickname
        timestamp
        blockNumber
        logIndex
      }
    }
  `;

  const data = await fetchGraphQL(LAOS_GRAPHQL, query);
  return enrichEvents(data.registerMercenaries, LAOS_CHAIN_ID, EventType.RegisterMercenaryEvent);
}