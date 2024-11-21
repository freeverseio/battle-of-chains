// hooks/useUserByAddress.ts
import { useQuery } from "@apollo/client";
import { USER_BY_ADDRESS } from "@/graphql/queries/userByAddress";

export const useUserByAddress = (address: `0x${string}`) => {
  const { data, loading, error, refetch } = useQuery(USER_BY_ADDRESS, {
    variables: { address },
  });
  return { data, loading, error, refetch };
};
