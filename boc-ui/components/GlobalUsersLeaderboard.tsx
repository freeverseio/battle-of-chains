"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useAllChainsScore } from "@/hooks/useAllChainsScore";
import { UserScore, Chain } from "@/types";
import { chainIcons } from "@/utils/chainIcons";
import { chainColors } from "@/utils/chainColors";
import { useAccount } from "wagmi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatAddress } from "@/utils/formatAddress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { tooltips } from "@/constants/tooltips";
import { Info } from "lucide-react";

// Import your Select components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select"; // Adjust path if needed

export const GlobalUsersLeaderboard = () => {
  const { loading, error, data } = useAllChainsScore();
  const { address: currentUserAddress } = useAccount();

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null); // use chainId as filter

  if (loading) return <div>Loading global user data...</div>;
  if (error) return <div>Error loading global user data: {error.message}</div>;

  const chains: Chain[] = data?.allChains?.nodes || [];

  // Flatten all users into one array
  const allUsers = chains.flatMap((chain) =>
    (chain.usersByHomechain?.nodes || []).map((user) => ({
      ...user,
      chain,
    }))
  );

  // Sort all users globally by score (descending)
  const sortedUsers = [...allUsers].sort(
    (a, b) => Number(b.score) - Number(a.score)
  );

  // Assign global ranks
  const globallyRankedUsers = sortedUsers.map((user, index) => ({
    ...user,
    globalRank: index + 1,
  }));

  // Filter by selectedChainId if not null
  const filteredUsers =
    selectedChainId === null
      ? globallyRankedUsers
      : globallyRankedUsers.filter((u) => u.chain.chainId === selectedChainId);

  // Limit to top 50 users
  const displayedUsers = filteredUsers.slice(0, 50);

  // Copy address to clipboard
  const copyAddressToClipboard = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddress(addr);
      // Clear message after 2 seconds
      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Card className="border border-border card-background mt-8 relative">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-4xl font-semibold text-label-secondary">
              User Leaderboard
            </span>
            <TooltipProvider>
          {tooltips.inventory && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltips.userLeaderboard}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
        </div>
        <Select
        value={selectedChainId?.toString() ?? "all"}
        onValueChange={(value) =>
            setSelectedChainId(value === "all" ? null : Number(value))}
            >
<SelectTrigger className="w-[200px] bg-transparent text-xl focus:ring-0 data-[placeholder]:text-gray-500 text-white">
<SelectValue  placeholder="Select a Chain" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all" className="flex items-center gap-2 mr-10">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">All chains</span>
                </div>
                </SelectItem>
                {chains.map((chain: Chain) => (
                <SelectItem
                    key={chain.chainId}
                    value={chain.chainId.toString()}
                    className="flex items-center gap-2 "
                >
                    <div className="flex items-center gap-2">
                    {chainIcons[chain.chainId] && (
                        <Image
                        src={chainIcons[chain.chainId]}
                        alt={chain.name}
                        width={24}
                        height={24}
                        className="object-contain"
                        />
                    )}
                    <span className="text-2xl ">{chain.name}</span>
                    </div>
                </SelectItem>
                ))}
            </SelectContent>
        </Select>
        </CardTitle>
      
      </CardHeader>
      <CardContent>
        <div className="mt-4 overflow-x-auto relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground text-2xl">Ranking</TableHead>
                <TableHead className="text-foreground text-2xl">Name</TableHead>
                <TableHead className="text-foreground text-2xl">Address</TableHead>
                <TableHead className="text-foreground text-2xl">
                  <div className="flex items-center space-x-2">
                    <span>Chain</span>
                    <div className="w-44"> {/* Adjust width as needed */}
                   
                    </div>
                  </div>
                </TableHead>
                <TableHead className="text-foreground text-2xl">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedUsers.map((user) => {
                const { chain, globalRank } = user;
                const chainIcon = chainIcons[chain.chainId];
                const chainNameColor = chainColors[chain.chainId];
                const isCurrentUser = user.address === currentUserAddress;

                return (
                  <TableRow key={`${user.address}-${chain.chainId}`}>
                    <TableCell
                      className={`text-2xl ${
                        isCurrentUser ? "text-label font-bold" : "text-label-secondary"
                      }`}
                    >
                      #{globalRank}
                    </TableCell>
                    <TableCell
                      className={`text-2xl ${
                        isCurrentUser ? "text-label font-bold" : "text-foreground"
                      }`}
                    >
                      {user.name}
                    </TableCell>
                    <TableCell className="relative text-2xl">
                      <span
                        onClick={() => copyAddressToClipboard(user.address)}
                        className={`cursor-pointer ${
                          isCurrentUser ? "text-label font-bold" : "text-foreground"
                        } hover:underline`}
                      >
                        {formatAddress(user.address)}
                      </span>

                      {/* Tooltip for Copied */}
                      {copiedAddress === user.address && (
                        <div className="absolute bottom-6 left-[180px] transform -translate-x-1/2 bg-black text-card-foreground px-2 py-1 rounded text-sm whitespace-nowrap pointer-events-none z-50">
                          Copied to clipboard
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-2xl flex items-center space-x-2">
                      {chainIcon && (
                        <Image
                          src={chainIcon}
                          alt={`${chain.name} icon`}
                          width={30}
                          height={30}
                          className="inline-block"
                        />
                      )}
                      <span style={{ color: chainNameColor }}>{chain.name}</span>
                    </TableCell>
                    <TableCell
                      className={`text-2xl ${
                        isCurrentUser ? "text-label font-bold" : "text-label-secondary"
                      }`}
                    >
                      {user.score}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
