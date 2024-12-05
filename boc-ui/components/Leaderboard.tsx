"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useAllChainsScore } from "@/hooks/useAllChainsScore";
import { UserScore, Chain } from "@/types";
import { chainIcons } from "@/utils/chainIcons";
import { chainColors } from "@/utils/chainColors";
import { useAccount } from "wagmi"; // Import useAccount from wagmi
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"; // Import Table components
import {formatAddress} from "@/utils/formatAddress";



export const ChainsLeaderboard = () => {
  const { loading, error, data } = useAllChainsScore();
  const { address } = useAccount(); // Get the connected address
  if (loading) return <div>Loading chain data...</div>;
  if (error) return <div>Error loading chain data: {error.message}</div>;

  const chains: Chain[] = data?.allChains?.nodes || [];

  return (
    <div className="space-y-8">
      {chains.map((chain: Chain) => {
        const users = chain.usersByHomechain?.nodes ?? [];
        const chainIcon = chainIcons[chain.chainId];
        const chainNameColor = chainColors[chain.chainId]; // Get the chain name color

        return (
          <Card
            key={chain.name}
            className="border border-border card-background"
          >
            <CardHeader>
              <div className="flex items-center">
                {/* Display the chain icon */}
                {chainIcon && (
                  <Image
                    src={chainIcon}
                    alt={`${chain.name} icon`}
                    width={60}
                    height={60}
                    className="mr-2"
                  />
                )}
                <CardTitle>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                    <span
                      className="text-4xl font-semibold"
                      style={{ color: chainNameColor }} // Apply the chain name color
                    >
                      {chain.name}:
                    </span>
                    <span className="text-4xl font-semibold text-label-secondary">
                      {chain.score} points
                    </span>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add overflow-x-auto here */}
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-foreground text-2xl">
                        Ranking
                      </TableHead>
                      <TableHead className="text-foreground text-2xl">
                        Name
                      </TableHead>
                      <TableHead className="text-foreground text-2xl">
                        Address
                      </TableHead>
                      <TableHead className="text-foreground text-2xl">
                        Score
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: UserScore, index) => (
                      <TableRow key={user.address}>
                        <TableCell
                          className={`text-2xl ${
                            user.address === address
                              ? "text-label font-bold"
                              : "text-label-secondary"
                          }`}
                        >
                          #{index + 1}
                        </TableCell>
                        <TableCell
                          className={`text-2xl ${
                            user.address === address
                              ? "text-label font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {user.name}
                        </TableCell>
                        <TableCell
                          className={`text-2xl ${
                            user.address === address
                              ? "text-label font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {formatAddress(user.address)}
                        </TableCell>
                        <TableCell
                          className={`text-2xl ${
                            user.address === address
                              ? "text-label font-bold"
                              : "text-label-secondary"
                          }`}
                        >
                          {user.score}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
