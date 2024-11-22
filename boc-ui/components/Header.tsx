"use client";

import { FaGamepad } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectButton } from "@/components/ConnectButton";
import { useAccount } from "wagmi";
import { useUserByAddress } from "@/hooks/useUserByAddress";
import { RefreshButton } from "./RefreshButton";
import Link from "next/link";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { loading, error, data } = useUserByAddress(address || "0x");
  const user = data?.userByAddress;

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-2 flex flex-col gap-4">
        {/* Top Section */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <h1 className="text-3xl font-bold pixel-text">Battle Of Chains</h1>

          {/* Right Side Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {!loading && !error && user && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-label">
                  Treasury:
                </span>
                <span className="text-2xl font-semibold text-label-value">
                  {user.treasury}
                </span>
              </div>
            )}
            <ConnectButton />
            <RefreshButton />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="min-w-max">
            {" "}
            {/* This ensures the tabs don't get cut off */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="border-[1px] border-border w-full flex-nowrap">
                <TabsTrigger
                  value="home"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white whitespace-nowrap"
                >
                  Home
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white whitespace-nowrap"
                >
                  Inventory
                </TabsTrigger>
                <TabsTrigger
                  value="attack"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white whitespace-nowrap"
                >
                  Attack
                </TabsTrigger>
                <TabsTrigger
                  value="cdd"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white whitespace-nowrap"
                >
                  CDD Voting
                </TabsTrigger>
                <TabsTrigger
                  value="leaderboard"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white whitespace-nowrap"
                >
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white whitespace-nowrap"
                >
                  All Logs
                </TabsTrigger>
                {process.env.NEXT_PUBLIC_TUTORIAL_URL && (
                  <Link
                    href={process.env.NEXT_PUBLIC_TUTORIAL_URL || ""}
                    target="_blank"
                    className="mx-2 text-2xl font-bold text-transparent bg-clip-text bg-[length:200%_200%] animate-wave whitespace-nowrap hover:text-white bg-custom-gradient"
                  >
                    Tutorial{" "}
                  </Link>
                )}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </header>
  );
}
