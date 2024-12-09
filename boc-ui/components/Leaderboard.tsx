"use client";

import React from "react";

import { useAllChainsScore } from "@/hooks/useAllChainsScore";
import { UserScore, Chain } from "@/types";
import { useAccount } from "wagmi"; 
import { ChainsLeaderboard } from "./ChainsLeaderboard";
import { GlobalUsersLeaderboard } from "./GlobalUsersLeaderboard";

export const Leaderboard = () => {
  const { loading, error, data } = useAllChainsScore();
  const { address } = useAccount();
  if (loading) return <div>Loading chain data...</div>;
  if (error) return <div>Error loading chain data: {error.message}</div>;

  const chains: Chain[] = data?.allChains?.nodes || [];

  return (
    <div className="space-y-8">
      {/* Existing Chain Leaderboard */}
      <ChainsLeaderboard />
      
      {/* New Global Users Leaderboard */}
      <GlobalUsersLeaderboard />
    </div>
  );
};
