// hooks/useUserByAddress.ts
import { useQuery } from "@apollo/client";
import { USER_BY_ADDRESS } from "@/graphql/queries/userByAddress";

export const useUserByAddress = (address: `0x${string}`) => {
  return useQuery(USER_BY_ADDRESS, {
    variables: { address },
  });
};
