// hooks/useAllLogs.ts
import { useQuery } from "@apollo/client";
import { ALL_LOGS } from "@/graphql/queries/allLogs";

export const useAllLogs = () => {
  return useQuery(ALL_LOGS);
};
