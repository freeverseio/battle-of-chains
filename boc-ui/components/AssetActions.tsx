// components/AssetActions.tsx
"use client";

import React from "react";
import { DeadAsset } from "./DeadAsset";
import { UpgradeButton } from "./UpgradeButton";
import { AssetViewerButton } from "./AssetViewerButton";

interface AssetActionsProps {
  tokenId: string;
  chainId: number;
  health: string;
  areButtonsDisabled: boolean;
  className?: string;
}

export function AssetActions({
  tokenId,
  chainId,
  health,
  areButtonsDisabled,
  className,
}: AssetActionsProps) {
  return (
    <div className="absolute -top-6 right-4">
      <div className={`flex space-x-2 ${className}`}>
        {/* Conditionally render DeadAsset */}
        {health === "0" && <DeadAsset />}
        {/* Always render AssetViewerButton */}
        <AssetViewerButton tokenId={tokenId} chainId={chainId} />
        {/* Conditionally render UpgradeButton */}
        {tokenId !== "0" && (
          <UpgradeButton
            tokenId={tokenId}
            chainId={chainId}
            areButtonsDisabled={areButtonsDisabled}
          />
        )}
      </div>
    </div>
  );
}
