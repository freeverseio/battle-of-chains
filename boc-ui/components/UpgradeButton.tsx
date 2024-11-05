// components/UpgradeButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";
import { Button } from "@/components/ui/button";

interface UpgradeButtonProps {
  buildingType: "CoinFactory" | "Teleporter";
  className?: string;
}

export function UpgradeButton({ buildingType, className }: UpgradeButtonProps) {
  const chain = { id: 137 };

  const { upgrade, isWritePending, isConfirming, isConfirmed, writeError } =
    useBattleOfChains();

  const [tokenId, setTokenId] = useState<number | null>(null);

  useEffect(() => {
    // Map building types to token IDs
    if (buildingType === "CoinFactory") {
      setTokenId(1); // Replace with actual tokenId for Coin Factory
    } else if (buildingType === "Teleporter") {
      setTokenId(2); // Replace with actual tokenId for Teleporter
    }
  }, [buildingType]);

  const handleUpgrade = () => {
    if (tokenId === null) {
      alert("Invalid token ID");
      return;
    }
    if (!chain?.id) {
      alert("Unable to determine chain ID");
      return;
    }
    upgrade(chain.id, tokenId);
  };

  return (
    <div>
      <Button
        onClick={handleUpgrade}
        disabled={isWritePending || isConfirming}
        className={`bg-primary border-[1px] border-[#FE07DD] hover:bg-[#FE07DD] hover:text-black ${className} `}
      >
        {isWritePending || isConfirming ? "Upgrading..." : "Upgrade"}
      </Button>
      {writeError && (
        <>
          <p className="text-red-500 text-xl">
            {writeError.message.toLowerCase().includes("user rejected")
              ? "Signature rejected by user"
              : "Oops, something went wrong"}
          </p>
          {console.error(writeError.message)}
        </>
      )}
      {isConfirmed && (
        <p className="text-xl text-green-500">Upgrade successful!</p>
      )}
    </div>
  );
}
