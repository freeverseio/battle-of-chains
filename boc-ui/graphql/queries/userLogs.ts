// graphql/queries/userLogs.ts
import { gql } from "@apollo/client";

export const USER_LOGS = gql`
  query UserLogs($userAddress: String!) {
    allLogs(condition: { userAddress: $userAddress }, orderBy: ID_DESC) {
      nodes {
        comment
        id
        timestamp
      }
    }
  }
`;
