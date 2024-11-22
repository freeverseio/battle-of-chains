"use client";

import { useState } from "react";
import HomeBase from "@/components/HomeBase";
import GlobalMap from "@/components/GlobalMap";
import Inventory from "@/components/Inventory";
import { AttackMap } from "@/components/AttackMap";
import CDDVoting from "@/components/CDDVoting";
import { SummaryTable } from "./SummaryTable";
import { useAccount } from "wagmi";
import { useUserByAddress } from "@/hooks/useUserByAddress";
import { ChainSelection } from "./ChainSelection";
import { useHasHomeChain } from "@/hooks/useBattleOfChains";
import { ChainsLeaderboard } from "@/components/Leaderboard";
interface DynamicContentProps {
  activeTab: string;
}

export default function DynamicContent({ activeTab }: DynamicContentProps) {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { loading, error, data, refetch } = useUserByAddress(address || "0x");
  const hasChain = data?.userByAddress !== null;
  if (loading) {

  const { loading, error, data, refetch } = useUserByAddress(
    address ? address : "0x"
  );
  const hasChain = data?.userByAddress !== null;
  if (loading) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    // Common checks for wallet-dependent tabs
    const needsWallet = ["home", "inventory", "attack", "cdd"].includes(
      activeTab
    );
    if (needsWallet) {
      if (!address) {
        return <div className="text-3xl">Please connect your wallet</div>;
      }
      console.log("hasChain", hasChain);

      if (!hasChain) {
        return <ChainSelection onJoinSuccess={refetch} />;
      }
    }

    switch (activeTab) {
      case "cdd":
        return <CDDVoting treasury={10} />;
      case "summary":
        return <SummaryTable />;
      case "inventory":
        return <Inventory />;
      case "home":
        return <HomeBase />;
      case "attack":
        return <AttackMap />;
      case "leaderboard":
        return <ChainsLeaderboard />;
        {
          /* case "production":
        return (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <SoftCoinProduction
              coinFactoryHealth={100}
              productionRate={10}
              treasury={treasury}
            />
          </div>
        );
        
      
      case "map":
        return <GlobalMap />;
      
      
       */
        }
      default:
        return <div>Select a tab</div>;
    }
  };

  return <div className="container mx-auto px-4 py-8">{renderContent()}</div>;
}
