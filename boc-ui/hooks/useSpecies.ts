// hooks/useSpecies.ts

import { useQuery, gql } from "@apollo/client";
import { ALL_SPECIES } from "@/graphql/queries/allSpecies";

interface Species {
  id: number;
  name: string;
}

export const useSpecies = () => {
  const { loading, error, data } = useQuery(ALL_SPECIES);

  const attackSpecies: Species[] = data?.allAttackSpecies?.nodes || [];
  const defendSpecies: Species[] = data?.allDefendSpecies?.nodes || [];

  return {
    loading,
    error,
    attackSpecies,
    defendSpecies,
  };
};
