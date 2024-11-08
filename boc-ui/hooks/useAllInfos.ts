// hooks/useAllInfos.ts
import { useQuery } from "@apollo/client";
import { ALL_INFOS } from "../graphql/queries/allInfos";

export const useAllInfos = () => {
  return useQuery(ALL_INFOS);
};
