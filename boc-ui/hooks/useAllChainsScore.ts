// hooks/useAllUsers.ts
import { useQuery } from "@apollo/client";
import { ALL_CHAINS_SCORE } from "@/graphql/queries/allChainsScore";

export const useAllChainsScore = () => {
  return useQuery(ALL_CHAINS_SCORE);
};
