// components/UserArmy.tsx
"use client";

import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useUserAssets } from "@/hooks/useUserAssets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MultichainMintButton } from "./MintButton";
import { UpgradeButton } from "./UpgradeButton";
import { Token } from "graphql";
import { useNftTypes } from "@/hooks/useNftTypes";

interface Asset {
  attack: string;
  xp: string;
  type: string;
  tokenId: string;
  level: string;
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

  const { loading, error, data } = useUserAssets(
    address ? `0x${address.toLowerCase().slice(2)}` : "0x"
  );
  const { loading: nftLoading, error: nftError, nftTypes } = useNftTypes();

  if (nftLoading) return <div></div>;
  if (nftError) return <div>Error loading asset names: {nftError.message}</div>;

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

  return (
    <Card className="border border-border card-background">
      <CardHeader>
        <CardTitle className="text-4xl">
          Your Inventory ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={String(assetTypes[0])} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 gap-2">
            {assetTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={String(type)}
                className="border-foreground border text-xl"
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
                <div className="mt-6">
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
                      {chainAssets.map((asset) => (
                        <Card
                          key={asset.tokenId}
                          className="p-4 hover:shadow-lg transition-shadow relative"
                        >
                          <div className="space-y-3">
                            {/* Header with ID and Level */}
                            <div className="flex justify-between items-center border-b border-border pb-2">
                              <span className="text-muted-foreground text-lg">
                                ID: {asset.tokenId.slice(0, 6)}...
                                {asset.tokenId.slice(-4)}
                              </span>
                              <span className="text-foreground font-bold text-xl">
                                Level {asset.level}
                              </span>
                            </div>

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
                            <UpgradeButton
                              tokenId={asset.tokenId}
                              chainId={asset.chainByChainId.chainId}
                            />
                          </div>
                        </Card>
                      ))}
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
