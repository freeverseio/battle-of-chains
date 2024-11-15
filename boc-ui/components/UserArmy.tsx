// components/UserArmy.tsx

"use client";

import React, { useState, useContext } from "react";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useUserAssets } from "@/hooks/useUserAssets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MultichainMintButton } from "./MintButton";
import { useNftTypes } from "@/hooks/useNftTypes";
import { useSpecies } from "@/hooks/useSpecies";
import Image from "next/image";
import { AssetActions } from "./AssetActions";
import { ModalContext } from "@/context/ModalContext";

interface Asset {
  attack: string;
  xp: string;
  type: string;
  tokenId: string;
  level: string;
  species: string;
  health: string;
  defense: string;
  chainByChainId: {
    name: string;
    chainId: number;
  };
}

interface AssetsByChain {
  [chain: string]: Asset[];
}

const StatDisplay = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground text-lg">{label}:</span>
    <span className="text-foreground text-lg">{value}</span>
  </div>
);

export const UserArmy = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { areButtonsDisabled } = useContext(ModalContext);

  const { loading, error, data } = useUserAssets(
    address ? `0x${address.toLowerCase().slice(2)}` : "0x"
  );
  const { loading: nftLoading, error: nftError, nftTypes } = useNftTypes();
  const {
    loading: speciesLoading,
    error: speciesError,
    attackSpecies,
    defendSpecies,
  } = useSpecies();

  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const copyTokenIdToClipboard = async (tokenId: string) => {
    try {
      await navigator.clipboard.writeText(tokenId);
      setCopiedTokenId(tokenId);
      // Clear the message after 2 seconds
      setTimeout(() => {
        setCopiedTokenId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (nftLoading || speciesLoading) return <div>Loading data...</div>;
  if (nftError) return <div>Error loading asset names: {nftError.message}</div>;
  if (speciesError)
    return <div>Error loading species data: {speciesError.message}</div>;

  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected || !address || address === "0x")
    return <div>Disconnected</div>;
  if (loading) return <div>Loading army data...</div>;
  if (error) return <div>Error loading army data: {error.message}</div>;

  const assets = data?.userByAddress?.assetsByOwner?.nodes || [];
  const totalCount = data?.userByAddress?.assetsByOwner?.totalCount || 0;

  const assetTypes = [2, 3, 0, 1];

  const assetsByType = assetTypes.reduce(
    (acc: { [key: string]: Asset[] }, type) => {
      acc[type] = assets.filter((asset: Asset) => asset.type === String(type));
      return acc;
    },
    {}
  );

  const groupAssetsByChain = (assets: Asset[]): AssetsByChain => {
    return assets.reduce((acc: AssetsByChain, asset: Asset) => {
      const chain = asset.chainByChainId.name;
      if (!acc[chain]) {
        acc[chain] = [];
      }
      acc[chain].push(asset);
      return acc;
    }, {});
  };

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
      // For types 2 and 3, do not return species name
      return null;
    }
  };

  return (
    <Card className="border border-border card-background">
      <CardHeader>
        <CardTitle className="text-4xl">
          Your Inventory ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={String(assetTypes[0])} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
            {assetTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={String(type)}
                className="border-foreground border text-md mb-8 sm:mb-0 sm:text-md lg:text-xl whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {nftTypes[type] || `Type ${type}`} (
                {(assetsByType[type] || []).length})
              </TabsTrigger>
            ))}
          </TabsList>

          {assetTypes.map((type) => {
            const assetsOfType = assetsByType[type] || [];
            const assetsByChain = groupAssetsByChain(assetsOfType);

            return (
              <TabsContent key={type} value={String(type)}>
                <div className="mt-14 sm:mt-6">
                  <MultichainMintButton
                    type={String(type)}
                    label={`${nftTypes[type]}`}
                  />
                </div>
                {Object.entries(assetsByChain).map(([chain, chainAssets]) => (
                  <div key={chain} className="mt-6 mb-8">
                    <h3 className="text-3xl text-label-secondary mb-4 font-semibold">
                      {chain}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {chainAssets.map((asset) => {
                        const speciesName = getSpeciesName(asset);

                        return (
                          <Card
                            key={asset.tokenId}
                            className="relative p-4 hover:shadow-lg transition-shadow"
                          >
                            {/* Copied to Clipboard Message */}
                            {copiedTokenId === asset.tokenId && (
                              <div className="absolute top-16 right-16 bg-black text-card-foreground px-2 py-1 rounded text-sm">
                                Copied to clipboard
                              </div>
                            )}
                            <div className="space-y-3">
                              {/* Header with Species Name and Level */}
                              <div className="flex justify-between items-center border-b border-border pb-2">
                                {/* Conditionally display species name and icon */}
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
                                    <span className="text-muted-foreground text-lg">
                                      {speciesName}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-lg">
                                    {`${nftTypes[type]}`}
                                  </span>
                                )}
                                <span className="text-foreground font-bold text-xl">
                                  Level {asset.level}
                                </span>
                              </div>
                              {/* Token ID with Copy Functionality */}
                              <button
                                onClick={() =>
                                  copyTokenIdToClipboard(asset.tokenId)
                                }
                                className="text-muted-foreground text-md hover:underline cursor-pointer"
                              >
                                ID: {asset.tokenId.slice(0, 6)}...
                                {asset.tokenId.slice(-4)}
                              </button>
                              {/* Combat Stats */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <StatDisplay
                                    label="Attack"
                                    value={asset.attack}
                                  />
                                  <StatDisplay
                                    label="Defense"
                                    value={asset.defense}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <StatDisplay
                                    label="Health"
                                    value={asset.health}
                                  />
                                  <StatDisplay label="XP" value={asset.xp} />
                                </div>
                              </div>
                              {/* Asset Actions */}
                              <AssetActions
                                tokenId={asset.tokenId}
                                chainId={asset.chainByChainId.chainId}
                                health={asset.health}
                                areButtonsDisabled={areButtonsDisabled}
                              />
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
