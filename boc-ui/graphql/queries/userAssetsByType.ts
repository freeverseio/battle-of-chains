// graphql/queries/userAssetsByType.ts
import { gql } from "@apollo/client";

export const USER_ASSETS_BY_TYPE = gql`
  query AllAssets($type: String!, $address: String!) {
    allAssets(
      condition: { type: $type, owner: $address }
      orderBy: LEVEL_DESC
    ) {
      nodes {
        level
        tokenId
      }
    }
  }
`;
