"use client";

import { FaGamepad } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectButton } from "@/components/ConnectButton";
import { useAccount } from "wagmi";
import { useUserByAddress } from "@/hooks/useUserByAddress";
import { RefreshButton } from "./RefreshButton";

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
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-y-4">
        {/* Logo and Soft Coins */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full sm:w-auto">
          {/* Logo */}
          <h1 className="text-3xl font-bold pixel-text">Battle Of Chains</h1>
        </div>

        {/* Right Side: Tabs, Connect Button */}
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-4">
          {/* Tabs */}
          <div className="w-full sm:w-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full border-[1px] border-border">
                <TabsTrigger
                  value="home"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white"
                >
                  Home
                </TabsTrigger>

                {/*<TabsTrigger
                  value="map"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white"
                >
                  Map
                </TabsTrigger>*/}
                <TabsTrigger
                  value="inventory"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white"
                >
                  Army
                </TabsTrigger>
                <TabsTrigger
                  value="attack"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white"
                >
                  Attack
                </TabsTrigger>
                {/* <TabsTrigger
                  value="production"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white"
                >
                  Production
                </TabsTrigger>
                */}
                <TabsTrigger
                  value="cdd"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white"
                >
                  CDD Voting
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:text-accent-foreground data-[state=active]:bg-muted text-2xl text-muted hover:text-white"
                >
                  All Logs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {!loading && !error && user && (
            <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
              <span className="text-2xl font-semibold text-label">
                Soft Coins:
              </span>
              <span className="text-2xl font-semibold text-label-value">
                {user.treasury}
              </span>
            </div>
          )}
          {/* Connect Button */}
          <div>
            <ConnectButton />
          </div>
          <div>
            <RefreshButton />
          </div>
        </div>
      </div>
    </header>
  );
}
