// hooks/useUserAssets.ts
import { useQuery } from "@apollo/client";
import { USER_ASSETS } from "@/graphql/queries/userAssets";

export const useUserAssets = (address: `0x${string}`) => {
  const { data, loading, error, refetch } = useQuery(USER_ASSETS, {
    variables: { address },
  });
  return { data, loading, error, refetch };
};
