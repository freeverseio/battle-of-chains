// graphql/queries/allInfos.ts
import { gql } from "@apollo/client";

export const ALL_INFOS = gql`
  query AllInfos {
    allInfos {
      nodes {
        key
        value
      }
    }
  }
`;
