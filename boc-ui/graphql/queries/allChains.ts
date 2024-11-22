import { gql } from "@apollo/client";

export const ALL_CHAINS = gql`
  query MyQuery {
    allChains {
      nodes {
        chainId
        name
      }
    }
  }
`;
