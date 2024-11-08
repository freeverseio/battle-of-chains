// graphql/queries/allLogs.ts
import { gql } from "@apollo/client";

export const ALL_SPECIES = gql`
  query AllSpecies {
    allAttackSpecies {
      nodes {
        id
        name
      }
    }
    allDefendSpecies {
      nodes {
        id
        name
      }
    }
  }
`;
