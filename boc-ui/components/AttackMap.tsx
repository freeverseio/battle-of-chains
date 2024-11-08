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
import { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useSpecies } from "@/hooks/useSpecies";
import Image from "next/image";

interface Asset {
  tokenId: string;
  level: number;
  xp: number;
  species: string;
  type: string;
  chainByChainId: {
    name: string;
    chainId: number;
  };
}

export const AttackMap = () => {
  const { address: currentUserAddress } = useAccount();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTokensPerChain, setSelectedTokensPerChain] = useState<{
    [chainName: string]: string[];
  }>({});

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

  if (usersLoading || assetsLoading || speciesLoading)
    return <div>Loading...</div>;
  if (speciesError)
    return <div>Error loading species data: {speciesError.message}</div>;

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
    return (
      currentUserAssets?.userByAddress?.assetsByOwner?.nodes.filter(
        (asset: Asset) =>
          asset.chainByChainId.name === chainName &&
          (asset.type === "0" || asset.type === "1")
      ) || []
    );
  };

  const handleAssetSelection = (chainName: string, tokenId: string) => {
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
                  {user.chainByHomechain?.name}
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
                          setSelectedTokensPerChain({});
                        }}
                        className="text-foreground text-xl border border-border hover:bg-gray-900 transition-all duration-200"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
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
                        {Object.entries(getAssetsByChain(user)).map(
                          ([chain, count]) => {
                            const userAssets =
                              getCurrentUserAssetsForChain(chain);

                            return (
                              <div
                                key={chain}
                                className="space-y-6 p-4 border border-border rounded-lg"
                              >
                                {/* Chain Name */}
                                <div>
                                  <h2 className="text-2xl font-bold text-label-secondary mb-2">
                                    {chain}
                                  </h2>
                                  <hr className="border-t border-border" />
                                </div>

                                {/* Flex container for Target's Assets and Your Assets */}
                                <div className="flex flex-col md:flex-row md:space-x-4">
                                  {/* Target's Assets */}
                                  <div className="md:w-1/2">
                                    <h3 className="text-xl font-semibold text-label mb-2">
                                      Target's Assets
                                    </h3>
                                    <p className="text-lg text-muted-foreground">
                                      {user.name} has <strong>{count}</strong>{" "}
                                      assets on {chain}.
                                    </p>
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
                                          assets on {chain}.
                                        </p>

                                        {/* Asset Selection Dropdown */}
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="w-full bg-transparent text-foreground text-lg justify-between"
                                            >
                                              {(selectedTokensPerChain[chain]
                                                ?.length || 0) > 0
                                                ? `${selectedTokensPerChain[chain].length} assets selected`
                                                : "Select assets to attack with"}
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent
                                            className="bg-black border border-border w-full max-h-[300px] overflow-y-auto"
                                            align="center"
                                          >
                                            {/* Select/Unselect All Button */}
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
                                                      chain
                                                    ]?.length ===
                                                    userAssets.length;
                                                  setSelectedTokensPerChain(
                                                    (prev) => ({
                                                      ...prev,
                                                      [chain]: allSelected
                                                        ? []
                                                        : userAssets.map(
                                                            (asset: Asset) =>
                                                              asset.tokenId
                                                          ),
                                                    })
                                                  );
                                                }}
                                              >
                                                {selectedTokensPerChain[chain]
                                                  ?.length === userAssets.length
                                                  ? "Unselect All"
                                                  : "Select All"}
                                              </Button>
                                            </div>
                                            {/* Asset List */}
                                            {userAssets.map((asset: Asset) => {
                                              const speciesName =
                                                getSpeciesName(asset);

                                              return (
                                                <div
                                                  key={asset.tokenId}
                                                  className="flex items-center space-x-2 p-2 hover:bg-gray-900 cursor-pointer"
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
                                                  {speciesName ? (
                                                    <div className="flex items-center">
                                                      <Image
                                                        src={`/asset_icons/${
                                                          asset.type === "0"
                                                            ? "attack"
                                                            : "defense"
                                                        }/${asset.species}.png`}
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
                                                      (Level {asset.level}, XP{" "}
                                                      {asset.xp})
                                                    </span>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                        {/* Attack Action */}
                                        {selectedTokensPerChain[chain]?.length >
                                          0 && (
                                          <div className="mt-4">
                                            <AttackButton
                                              targetAddress={user.address}
                                              targetChain={
                                                userAssets[0].chainByChainId
                                                  .chainId
                                              }
                                              tokenIds={
                                                selectedTokensPerChain[chain]
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
                                          You have no assets on {chain} to
                                          attack with.
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
