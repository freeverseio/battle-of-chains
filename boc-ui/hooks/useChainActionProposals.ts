// hooks/useChainActionProposals.ts
import { useQuery } from "@apollo/client";
import { CHAIN_ACTION_PROPOSALS } from "@/graphql/queries/chainActionProposals";

export const useChainActionProposals = () => {
  return useQuery(CHAIN_ACTION_PROPOSALS);
};
