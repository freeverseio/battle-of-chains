// queries/getNftTypes.ts
import { gql } from "@apollo/client";

export const NFT_TYPES = gql`
  query NftTypes {
    allNftTypes {
      nodes {
        id
        name
      }
    }
  }
`;
