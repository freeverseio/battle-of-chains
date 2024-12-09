import { gql } from "@apollo/client";

export const ALL_CHAINS_SCORE = gql`
  query MyQuery {
    allChains(orderBy: SCORE_DESC) {
      nodes {
        chainId
        score
        name
        usersByHomechain(orderBy: SCORE_DESC, first: 15) {
          nodes {
            address
            score
            name
          }
        }
      }
    }
  }
`;
