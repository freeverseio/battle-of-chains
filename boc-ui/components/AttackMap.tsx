"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttackButton } from "@/components/AttackButton";
import { useAllUsers } from "@/hooks/useAllUsers";
import { useUserByAddress } from "@/hooks/useUserByAddress";
import { useUserAssets } from "@/hooks/useUserAssets";
import { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
export const AttackMap = () => {
  const { address: currentUserAddress } = useAccount();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [selectedTokensPerChain, setSelectedTokensPerChain] = useState<{
    [chainName: string]: string[];
  }>({});

  const { data: allUsersData, loading: usersLoading } = useAllUsers();
  const { data: currentUserAssets, loading: assetsLoading } = useUserAssets(
    currentUserAddress ? `0x${currentUserAddress.toLowerCase().slice(2)}` : "0x"
  );

  if (usersLoading || assetsLoading) return <div>Loading...</div>;

  const users =
    allUsersData?.allUsers?.nodes.filter(
      (user: User) =>
        user.address.toLowerCase() !== currentUserAddress?.toLowerCase()
    ) || [];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getAssetsByChain = (user: User) => {
    return user.assetsByOwner?.nodes.reduce(
      (acc: { [key: string]: number }, asset) => {
        const chainName = asset.chainByChainId.name;
        acc[chainName] = (acc[chainName] || 0) + 1;
        return acc;
      },
      {}
    );
  };

  const getCurrentUserAssetsForChain = (chainName: string) => {
    console.log(
      "getCurrentUserAssetsForChain",
      currentUserAssets?.userByAddress?.assetsByOwner?.nodes.filter(
        (asset: { chainByChainId: { name: string } }) =>
          asset.chainByChainId.name === chainName
      )
    );
    return (
      currentUserAssets?.userByAddress?.assetsByOwner?.nodes.filter(
        (asset: { chainByChainId: { name: string } }) =>
          asset.chainByChainId.name === chainName
      ) || []
    );
  };
  const handleAssetSelection = (chainName: string, tokenId: string) => {
    setSelectedChain(chainName);
    setSelectedTokensPerChain((prev) => {
      const chainTokens = prev[chainName] || [];
      const newChainTokens = chainTokens.includes(tokenId)
        ? chainTokens.filter((id) => id !== tokenId)
        : [...chainTokens, tokenId];

      return {
        ...prev,
        [chainName]: newChainTokens,
      };
    });
  };

  return (
    <Card className="border border-border card-background">
      <CardHeader>
        <CardTitle className="text-4xl">Players</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground text-2xl">Name</TableHead>
              <TableHead className="text-foreground text-2xl">
                Home Chain
              </TableHead>
              <TableHead className="text-foreground text-2xl">
                Address
              </TableHead>
              <TableHead className="text-label text-2xl">Soft Coins</TableHead>
              <TableHead className="text-foreground text-2xl">
                Total Assets
              </TableHead>
              <TableHead className="text-foreground text-2xl">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.address}>
                <TableCell className="text-muted-foreground text-2xl">
                  {user.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl">
                  {user.chainByHomechain.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl">
                  {formatAddress(user.address)}
                </TableCell>
                <TableCell className="text-label-value text-2xl">
                  {user.treasury}
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl">
                  {user.assetsByOwner.totalCount}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedTokenIds([]);
                          setSelectedChain(null);
                        }}
                        className="text-foreground text-xl border border-border hover:bg-gray-900 transition-all duration-200"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      showCloseButton={true}
                      className="bg-black border border-border text-foreground max-w-2xl"
                    >
                      <DialogHeader>
                        <DialogTitle className="text-3xl mb-4">
                          {user.name}'s Assets ({formatAddress(user.address)})
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {Object.entries(getAssetsByChain(user)).map(
                          ([chain, count]) => {
                            const userAssets =
                              getCurrentUserAssetsForChain(chain);

                            return (
                              <div
                                key={chain}
                                className="space-y-4 p-4 border border-border rounded-lg"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="space-y-1">
                                    <p className="text-2xl text-foreground text-label-secondary">
                                      {chain}
                                    </p>
                                    <p className="text-xl text-label">
                                      Target's assets: {count}
                                    </p>
                                    <p className="text-xl text-foreground">
                                      Your assets: {userAssets.length}
                                    </p>
                                  </div>

                                  {userAssets.length > 0 && (
                                    <div className="space-y-4">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-[280px] bg-transparent text-foreground  text-lg justify-between"
                                          >
                                            {(selectedTokensPerChain[chain]
                                              ?.length || 0) > 0
                                              ? `${selectedTokensPerChain[chain].length} assets selected`
                                              : "Select assets to attack with"}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          className="bg-black border border-border w-[280px] max-h-[300px] overflow-y-auto"
                                          align="end"
                                        >
                                          {userAssets.map(
                                            (asset: {
                                              tokenId: string;
                                              level: number;
                                              xp: number;
                                            }) => (
                                              <div
                                                key={asset.tokenId}
                                                className="flex l items-center space-x-2 p-2 hover:bg-gray-900 cursor-pointer"
                                                onClick={() =>
                                                  handleAssetSelection(
                                                    chain,
                                                    asset.tokenId
                                                  )
                                                }
                                              >
                                                <Checkbox
                                                  checked={selectedTokensPerChain[
                                                    chain
                                                  ]?.includes(asset.tokenId)}
                                                  className="border-border"
                                                />
                                                <span className="text-foreground">
                                                  Token{" "}
                                                  {formatAddress(asset.tokenId)}{" "}
                                                  (Level {asset.level}, XP{" "}
                                                  {asset.xp})
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>

                                      {selectedChain === chain &&
                                        selectedTokensPerChain[chain]?.length >
                                          0 && (
                                          <div className="space-y-2">
                                            <p className="text-lg text-muted-foreground">
                                              Selected{" "}
                                              {
                                                selectedTokensPerChain[chain]
                                                  .length
                                              }{" "}
                                              assets for attack
                                            </p>
                                            <AttackButton
                                              targetAddress={user.address}
                                              targetChain={
                                                getCurrentUserAssetsForChain(
                                                  chain
                                                )[0].chainByChainId.chainId
                                              } // Use the chainId directly
                                              tokenIds={
                                                selectedTokensPerChain[chain]
                                              }
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
