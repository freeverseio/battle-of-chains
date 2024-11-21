// hooks/useRefetchState.ts
import { useAllLogs } from "@/hooks/useAllLogs";
import { useUserLogs } from "@/hooks/useUserLogs";
import { useUserAssets } from "@/hooks/useUserAssets";
import { useUserByAddress } from "@/hooks/useUserByAddress";
import { useChainActionProposals } from "./useChainActionProposals";
import { useAccount } from "wagmi";
import { useCallback } from "react";

export const useRefetchState = () => {
  const { address } = useAccount();

  const { refetch: userLogsRefetch } = useUserLogs(address || "0x");
  const { refetch: allLogsRefetch } = useAllLogs();
  const { refetch: chainActionProposalsRefetch } = useChainActionProposals();

  const { refetch: userAssetsRefetch } = useUserAssets(
    address ? `0x${address.toLowerCase().slice(2)}` : "0x"
  );
  const { refetch: userByAddressRefecth } = useUserByAddress(
    address ? `0x${address.toLowerCase().slice(2)}` : "0x"
  );

  const refetchAll = useCallback(() => {
    userLogsRefetch();
    allLogsRefetch();
    userAssetsRefetch();
    userByAddressRefecth();
    chainActionProposalsRefetch();
  }, [
    userLogsRefetch,
    allLogsRefetch,
    userAssetsRefetch,
    userByAddressRefecth,
    chainActionProposalsRefetch,
  ]);

  return {
    refetchAll,
  };
};
