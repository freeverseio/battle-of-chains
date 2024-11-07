// hooks/useBattleOfChains.ts

import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import BattleOfChainsABI from "@/contracts/abi/BattleOfChains.json";
import { ChainAction } from "@/utils/enums";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_LAOS_CONTRACT_ADDRESS as `0x${string}`;

if (!CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is not defined");
}

export function useBattleOfChains() {
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    isSuccess: isWriteSuccess,
    error: writeError,
  } = useWriteContract();

  // Write functions
  return {
    joinHomeChain: (homeChain: number, nickname: string) =>
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: BattleOfChainsABI,
        functionName: "joinHomeChain",
        args: [homeChain, nickname],
      }),

    multichainMint: (type: string) =>
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: BattleOfChainsABI,
        functionName: "multichainMint",
        args: [type],
      }),

    attack: (
      tokenIds: string[],
      targetAddress: `0x${string}`,
      targetChain: number,
      strategy: number
    ) =>
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: BattleOfChainsABI,
        functionName: "attack",
        args: [tokenIds, targetAddress, targetChain, strategy],
      }),

    voteChainAction: (chainAction: ChainAction, comment: string) =>
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: BattleOfChainsABI,
        functionName: "voteChainAction",
        args: [chainAction, comment],
      }),

    upgrade: (chain: number, tokenId: string) =>
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: BattleOfChainsABI,
        functionName: "upgrade",
        args: [chain, tokenId],
      }),
    hash,
    // State variables
    isWritePending,
    isWriteSuccess,
    writeError,
    isConfirming: useWaitForTransactionReceipt({ hash }).isLoading,
    isConfirmed: useWaitForTransactionReceipt({ hash }).isSuccess,
  };
}

// Custom hooks for read functions
export function useHasHomeChain(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BattleOfChainsABI,
    functionName: "hasHomeChain",
    args: userAddress ? [userAddress] : undefined,
  });
}

export function useHomeChainOf(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BattleOfChainsABI,
    functionName: "homeChainOf",
    args: userAddress ? [userAddress] : undefined,
  });
}

export function useCreatorFromTokenId(tokenId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BattleOfChainsABI,
    functionName: "creatorFromTokenId",
    args: tokenId !== undefined ? [tokenId] : undefined,
  });
}

export function useCoordinatesOf(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BattleOfChainsABI,
    functionName: "coordinatesOf",
    args: address !== undefined ? [address] : undefined,
  });
}

export function useTokenURI(tokenId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BattleOfChainsABI,
    functionName: "tokenURI",
    args: tokenId !== undefined ? [tokenId] : undefined,
  });
}
