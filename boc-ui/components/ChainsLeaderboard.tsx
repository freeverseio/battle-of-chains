// ChainsLeaderboard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useAllChainsScore } from "@/hooks/useAllChainsScore";
import { Chain } from "@/types";
import { chainIcons } from "@/utils/chainIcons";
import { chainColors } from "@/utils/chainColors";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { tooltips } from "@/constants/tooltips";
import { Info } from "lucide-react";

export const ChainsLeaderboard = () => {
  const { loading, error, data } = useAllChainsScore();

  if (loading) return <div>Loading chain data...</div>;
  if (error) return <div>Error loading chain data: {error.message}</div>;

  let chains: Chain[] = data?.allChains?.nodes || [];

  return (
    <Card className="border border-border card-background">
      <CardHeader>
      <div className="flex items-center space-x-2">
        <CardTitle>
          <h2 className="text-4xl font-bold">Chain Leaderboard</h2>
        </CardTitle>
        <TooltipProvider>
          {tooltips.chainLeaderboard && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltips.chainLeaderboard}</p>
              </TooltipContent>
            </Tooltip>
          )}
        
        </TooltipProvider>
        </div>
      </CardHeader>
    
      <CardContent>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground text-2xl">Ranking</TableHead>
                <TableHead className="text-foreground text-2xl">Chain</TableHead>
                <TableHead className="text-foreground text-2xl">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chains.map((chain: Chain, index) => {
                const chainIcon = chainIcons[chain.chainId];
                const chainNameColor = chainColors[chain.chainId];
                return (
                  <TableRow key={chain.name}>
                    <TableCell className="text-2xl text-label-secondary">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="flex items-center text-2xl text-foreground">
                      {chainIcon && (
                        <Image
                          src={chainIcon}
                          alt={`${chain.name} icon`}
                          width={30}
                          height={30}
                          className="mr-2"
                        />
                      )}
                      <span style={{ color: chainNameColor }}>{chain.name}</span>
                    </TableCell>
                    <TableCell className="text-2xl text-label-secondary">
                      {chain.score}
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
