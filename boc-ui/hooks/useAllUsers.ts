// hooks/useAllUsers.ts
import { useQuery } from "@apollo/client";
import { ALL_USERS } from "@/graphql/queries/allUsers";

export const useAllUsers = () => {
  return useQuery(ALL_USERS);
};
