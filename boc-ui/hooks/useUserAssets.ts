// hooks/useUserAssets.ts
import { useQuery } from "@apollo/client";
import { USER_ASSETS } from "@/graphql/queries/userAssets";

export const useUserAssets = (address: `0x${string}`) => {
  return useQuery(USER_ASSETS, {
    variables: { address },
  });
};
