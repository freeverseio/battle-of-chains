// hooks/useAllUsers.ts
import { useQuery } from "@apollo/client";
import { ALL_CHAINS } from "@/graphql/queries/allChains";

export const useAllChains = () => {
  return useQuery(ALL_CHAINS);
};
