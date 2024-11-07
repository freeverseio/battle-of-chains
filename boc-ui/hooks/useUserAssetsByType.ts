// hooks/useUserAssetsByType.ts
import { useQuery } from "@apollo/client";
import { USER_ASSETS_BY_TYPE } from "@/graphql/queries/userAssetsByType";

export const useUserAssetsByType = (type: string, address: `0x${string}`) => {
  return useQuery(USER_ASSETS_BY_TYPE, {
    variables: { type, address },
    skip: !type || !address, // Skip the query if address is not available
  });
};
