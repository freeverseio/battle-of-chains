// hooks/useUpdate.ts
import { useMutation } from "@apollo/client";
import { UPDATE } from "@/graphql/mutations/update";

export const useUpdate = () => {
  const [updateMutation, { loading, error }] = useMutation(UPDATE);

  const update = async () => {
    try {
      await updateMutation();
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  return {
    update,
    isUpdating: loading,
    error,
  };
};
