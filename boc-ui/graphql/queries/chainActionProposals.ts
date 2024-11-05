// graphql/queries/chainActionProposals.ts
import { gql } from "@apollo/client";

export const CHAIN_ACTION_PROPOSALS = gql`
  query ChainActionProposals {
    allChainActionProposals {
      nodes {
        attackAddress
        attackArea
        type
        votes
        chainByTargetChainId {
          name
        }
        chainBySourceChainId {
          name
        }
      }
      totalCount
    }
  }
`;
