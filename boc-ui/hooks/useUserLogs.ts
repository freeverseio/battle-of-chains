// hooks/useUserLogs.ts
import { useQuery } from "@apollo/client";
import { USER_LOGS } from "@/graphql/queries/userLogs";

export const useUserLogs = (address: `0x${string}`) => {
  const { data, loading, error, refetch } = useQuery(USER_LOGS, {
    variables: { userAddress: address },
  });
  return { data, loading, error, refetch };
};
