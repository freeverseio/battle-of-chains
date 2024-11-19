// components/AttackMap.tsx

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
import { AttackButton } from "@/components/AttackButton";
import { useAllUsers } from "@/hooks/useAllUsers";
import { useUserAssets } from "@/hooks/useUserAssets";
import { Chain, User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useSpecies } from "@/hooks/useSpecies";
import Image from "next/image";
import { useAllChains } from "@/hooks/useAllChains";
import Modal from "./Modal";

interface Asset {
  tokenId: string;
  level: number;
  xp: number;
  species: string;
  type: string;
  health: string;
  chainByChainId: {
    name: string;
    chainId: number;
  };
}

export const AttackMap = () => {
  const { address: currentUserAddress } = useAccount();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTokensPerChain, setSelectedTokensPerChain] = useState<{
    [chainId: number]: string[];
  }>({});
  const [copiedAddressIndex, setCopiedAddressIndex] = useState<number | null>(
    null
  );

  // Function to copy address to clipboard
  const copyAddressToClipboard = async (address: string, index: number) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddressIndex(index);
      // Clear the message after 2 seconds
      setTimeout(() => {
        setCopiedAddressIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  const { data: allUsersData, loading: usersLoading } = useAllUsers();
  const { data: currentUserAssets, loading: assetsLoading } = useUserAssets(
    currentUserAddress ? `0x${currentUserAddress.toLowerCase().slice(2)}` : "0x"
  );

  const {
    loading: speciesLoading,
    error: speciesError,
    attackSpecies,
    defendSpecies,
  } = useSpecies();

  const {
    data: allChainsData,
    loading: chainsLoading,
    error: chainsError,
  } = useAllChains();

  if (usersLoading || assetsLoading || speciesLoading || chainsLoading)
    return <div>Loading...</div>;
  if (speciesError)
    return <div>Error loading species data: {speciesError.message}</div>;
  if (chainsError)
    return <div>Error loading chains data: {chainsError.message}</div>;

  // Map species IDs to names
  const attackSpeciesMap = attackSpecies.reduce(
    (acc: { [key: string]: string }, species) => {
      acc[String(species.id)] = species.name;
      return acc;
    },
    {}
  );

  const defendSpeciesMap = defendSpecies.reduce(
    (acc: { [key: string]: string }, species) => {
      acc[String(species.id)] = species.name;
      return acc;
    },
    {}
  );

  const getSpeciesName = (asset: Asset): string | null => {
    if (asset.type === "0") {
      return attackSpeciesMap[asset.species] || asset.species;
    } else if (asset.type === "1") {
      return defendSpeciesMap[asset.species] || asset.species;
    } else {
      return null;
    }
  };

  const users =
    allUsersData?.allUsers?.nodes.filter(
      (user: User) =>
        user.address.toLowerCase() !== currentUserAddress?.toLowerCase()
    ) || [];

  const formatAddress = (address: string) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  // Function to get current user's alive assets for a specific chain
  const getCurrentUserAssetsForChain = (chainId: number) => {
    return (
      currentUserAssets?.userByAddress?.assetsByOwner?.nodes.filter(
        (asset: Asset) =>
          asset.chainByChainId.chainId === chainId &&
          (asset.type === "0" || asset.type === "1") &&
          parseInt(asset.health) > 0 // Only alive assets
      ) || []
    );
  };

  const handleAssetSelection = (chainId: number, tokenId: string) => {
    setSelectedTokensPerChain((prev) => {
      const chainTokens = prev[chainId] || [];
      const newChainTokens = chainTokens.includes(tokenId)
        ? chainTokens.filter((id) => id !== tokenId)
        : [...chainTokens, tokenId];

      return {
        ...prev,
        [chainId]: newChainTokens,
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
              <TableHead className="text-label text-2xl">Treasury</TableHead>
              <TableHead className="text-foreground text-2xl">
                Total Assets
              </TableHead>
              <TableHead className="text-foreground text-2xl">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User, index: number) => (
              <TableRow key={user.address}>
                <TableCell className="text-muted-foreground text-2xl">
                  {user.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl">
                  {user.chainByHomechain?.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl relative">
                  <button
                    onClick={() => copyAddressToClipboard(user.address, index)}
                    className="text-muted-foreground text-md hover:underline cursor-pointer"
                  >
                    {formatAddress(user.address)}
                  </button>
                  {copiedAddressIndex === index && (
                    <div className="absolute top-5 right-0 bg-black text-card-foreground px-2 py-1 rounded text-sm">
                      Copied to clipboard
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-label-value text-2xl">
                  {user.treasury}
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl">
                  {
                    (user.assetsByOwner.nodes as Asset[]).filter(
                      (asset: Asset) => parseInt(asset.health) > 0
                    ).length
                  }
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedTokensPerChain({});
                        }}
                        className="text-foreground text-xl border border-border hover:bg-gray-900 transition-all duration-200"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    {selectedUser && selectedUser.address === user.address && (
                      <DialogContent
                        showCloseButton={true}
                        className="bg-black border border-border text-foreground max-w-2xl max-h-screen h-screen sm:h-auto sm:max-h-[90vh] overflow-y-auto"
                      >
                        <style jsx>{`
                          ::-webkit-scrollbar {
                            width: 8px;
                          }
                          ::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          ::-webkit-scrollbar-thumb {
                            background-color: rgba(255, 255, 255, 0.2);
                            border-radius: 4px;
                          }
                          ::-webkit-scrollbar-thumb:hover {
                            background-color: rgba(255, 255, 255, 0.4);
                          }
                        `}</style>
                        <DialogHeader>
                          <DialogTitle className="text-3xl mb-4">
                            {user.name}'s Assets ({formatAddress(user.address)})
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {allChainsData.allChains.nodes.map(
                            (chainNode: Chain) => {
                              const chainName = chainNode.name;
                              const chainId = chainNode.chainId;

                              // Get target's alive assets for this chain
                              const targetAssets = (
                                user.assetsByOwner.nodes as Asset[]
                              ).filter(
                                (asset: Asset) =>
                                  asset.chainByChainId.chainId === chainId &&
                                  parseInt(asset.health) > 0
                              );

                              // Get current user's alive assets for this chain
                              const userAssets =
                                getCurrentUserAssetsForChain(chainId);

                              return (
                                <div
                                  key={chainId}
                                  className="space-y-6 p-4 border border-border rounded-lg"
                                >
                                  <div>
                                    <h2 className="text-2xl font-bold text-label-secondary mb-2">
                                      {chainName}
                                    </h2>
                                    <hr className="border-t border-border" />
                                  </div>

                                  <div className="flex flex-col md:flex-row md:space-x-4">
                                    {/* Target's Assets */}
                                    <div className="md:w-1/2">
                                      <h3 className="text-xl font-semibold text-label mb-2">
                                        Target's Assets
                                      </h3>
                                      {targetAssets.length > 0 ? (
                                        <div>
                                          <p className="text-lg text-muted-foreground">
                                            {user.name} has{" "}
                                            <strong>
                                              {targetAssets.length}
                                            </strong>{" "}
                                            assets on {chainName}.
                                          </p>
                                        </div>
                                      ) : (
                                        <p className="text-lg text-muted-foreground">
                                          {user.name} has no alive assets on{" "}
                                          {chainName}.
                                        </p>
                                      )}
                                    </div>

                                    {/* Your Assets */}
                                    <div className="md:w-1/2 mt-4 md:mt-0">
                                      {userAssets.length > 0 ? (
                                        <div>
                                          <h3 className="text-xl font-semibold text-foreground mb-2">
                                            Your Assets
                                          </h3>
                                          <p className="text-lg text-muted-foreground mb-2">
                                            You have{" "}
                                            <strong>{userAssets.length}</strong>{" "}
                                            assets on {chainName}.
                                          </p>

                                          {/* Asset Selection */}
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="outline"
                                                className="w-full bg-transparent text-foreground text-lg justify-between"
                                              >
                                                {(selectedTokensPerChain[
                                                  chainId
                                                ]?.length || 0) > 0
                                                  ? `${selectedTokensPerChain[chainId].length} assets selected`
                                                  : "Select assets to attack with"}
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                              className="bg-black border border-border w-full max-h-[300px] overflow-y-auto"
                                              align="center"
                                            >
                                              <div className="flex items-center justify-between p-2">
                                                <span className="text-foreground font-semibold">
                                                  Select Assets
                                                </span>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                    const allSelected =
                                                      selectedTokensPerChain[
                                                        chainId
                                                      ]?.length ===
                                                      userAssets.length;
                                                    setSelectedTokensPerChain(
                                                      (prev) => ({
                                                        ...prev,
                                                        [chainId]: allSelected
                                                          ? []
                                                          : userAssets.map(
                                                              (asset: Asset) =>
                                                                asset.tokenId
                                                            ),
                                                      })
                                                    );
                                                  }}
                                                >
                                                  {selectedTokensPerChain[
                                                    chainId
                                                  ]?.length ===
                                                  userAssets.length
                                                    ? "Unselect All"
                                                    : "Select All"}
                                                </Button>
                                              </div>
                                              {userAssets.map(
                                                (asset: Asset) => {
                                                  const speciesName =
                                                    getSpeciesName(asset);

                                                  return (
                                                    <div
                                                      key={asset.tokenId}
                                                      className="flex items-center space-x-2 p-2 hover:bg-gray-900 cursor-pointer"
                                                      onClick={() =>
                                                        handleAssetSelection(
                                                          chainId,
                                                          asset.tokenId
                                                        )
                                                      }
                                                    >
                                                      <Checkbox
                                                        checked={selectedTokensPerChain[
                                                          chainId
                                                        ]?.includes(
                                                          asset.tokenId
                                                        )}
                                                        className="border-border"
                                                      />
                                                      {speciesName ? (
                                                        <div className="flex items-center">
                                                          <Image
                                                            src={`/asset_icons/${
                                                              asset.type === "0"
                                                                ? "attack"
                                                                : "defense"
                                                            }/${
                                                              asset.species
                                                            }.png`}
                                                            alt={speciesName}
                                                            width={24}
                                                            height={24}
                                                            className="mr-2"
                                                          />
                                                          <span className="text-foreground">
                                                            {speciesName} (Level{" "}
                                                            {asset.level}, XP{" "}
                                                            {asset.xp})
                                                          </span>
                                                        </div>
                                                      ) : (
                                                        <span className="text-foreground">
                                                          Token{" "}
                                                          {formatAddress(
                                                            asset.tokenId
                                                          )}{" "}
                                                          (Level {asset.level},
                                                          XP {asset.xp})
                                                        </span>
                                                      )}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </DropdownMenuContent>
                                          </DropdownMenu>

                                          {/* Attack Button */}
                                          {selectedTokensPerChain[chainId]
                                            ?.length > 0 && (
                                            <div className="mt-4">
                                              <AttackButton
                                                targetAddress={user.address}
                                                targetChain={chainId}
                                                tokenIds={
                                                  selectedTokensPerChain[
                                                    chainId
                                                  ]
                                                }
                                                className="w-full"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div>
                                          <h3 className="text-xl font-semibold text-foreground mb-2">
                                            Your Assets
                                          </h3>
                                          <p className="text-lg text-muted-foreground">
                                            You have no alive assets on{" "}
                                            {chainName} to attack with.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Modal />
    </Card>
  );
};
