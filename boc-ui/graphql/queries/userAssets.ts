// graphql/queries/userAssets.ts
import { gql } from "@apollo/client";

export const USER_ASSETS = gql`
  query UserAssets($address: String!) {
    userByAddress(address: $address) {
      assetsByOwner(orderBy: TYPE_ASC) {
        totalCount
        nodes {
          attack
          xp
          type
          tokenId
          level
          health
          defense
          travelSpeed
          age
          potential
          species
          chainByChainId {
            name
            chainId
          }
        }
      }
    }
  }
`;
