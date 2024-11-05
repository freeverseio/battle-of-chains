// graphql/queries/allLogs.ts
import { gql } from "@apollo/client";

export const ALL_LOGS = gql`
  query AllLogs {
    allLogs(orderBy: ID_DESC) {
      nodes {
        chainByChain {
          name
        }
        comment
        userByUserAddress {
          name
          address
        }
        timestamp
      }
    }
  }
`;
