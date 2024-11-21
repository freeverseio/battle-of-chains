// hooks/useChainActionProposals.ts
import { useQuery } from "@apollo/client";
import { CHAIN_ACTION_PROPOSALS } from "@/graphql/queries/chainActionProposals";

export const useChainActionProposals = () => {
  const { data, loading, error, refetch } = useQuery(CHAIN_ACTION_PROPOSALS);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
