// graphql/queries/allUsers.ts
import { gql } from "@apollo/client";

export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      totalCount
      nodes {
        address
        score
        treasury
        name
        chainByHomechain {
          chainId
          name
        }
        assetsByOwner {
          totalCount
          nodes {
            chainByChainId {
              name
              chainId
            }
            type
            health
          }
        }
      }
    }
  }
`;
