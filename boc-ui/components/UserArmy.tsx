// components/UserArmy.tsx
"use client";

import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useUserAssets } from "@/hooks/useUserAssets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected || !address || address === "0x")
    return <div>Disconnected</div>;
  if (loading) return <div>Loading army data...</div>;
  if (error) return <div>Error loading army data: {error.message}</div>;

  const assets = data?.userByAddress?.assetsByOwner?.nodes || [];
  const totalCount = data?.userByAddress?.assetsByOwner?.totalCount || 0;

  const assetsByType = assets.reduce(
    (acc: { [key: string]: Asset[] }, asset: Asset) => {
      const type = asset.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(asset);
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
        <CardTitle className="text-4xl">Your Army ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(assetsByType)[0]} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.keys(assetsByType).map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="border-foreground border text-lg"
              >
                Type {type} ({assetsByType[type].length})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(assetsByType).map(([type, assets]) => {
            const assetsByChain = groupAssetsByChain(assets as Asset[]);

            return (
              <TabsContent key={type} value={type}>
                {Object.entries(assetsByChain).map(([chain, chainAssets]) => (
                  <div key={chain} className="mt-6 mb-8">
                    <h3 className="text-3xl text-label-secondary mb-4 font-semibold">
                      {chain}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {chainAssets.map((asset) => (
                        <Card
                          key={asset.tokenId}
                          className="p-4 hover:shadow-lg transition-shadow"
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
