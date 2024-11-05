// graphql/queries/userByAddress.ts
import { gql } from "@apollo/client";

export const USER_BY_ADDRESS = gql`
  query UserByAddress($address: String!) {
    userByAddress(address: $address) {
      address
      chain: chainByHomechain {
        name
        chainId
      }
      score
      name
      treasury
    }
  }
`;
