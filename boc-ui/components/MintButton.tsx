import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";

interface MultichainMintButtonProps {
  type: number;
  label: string;
  className?: string;
}

export const MultichainMintButton: React.FC<MultichainMintButtonProps> = ({
  type,
  label,
  className,
}) => {
  const {
    multichainMint,
    isConfirming,
    isConfirmed,
    isWriteSuccess,
    isWritePending,
    writeError,
  } = useBattleOfChains();

  const handleMint = async () => {
    try {
      await multichainMint(type);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div>
      <Button
        variant="default"
        size="sm"
        className={`bg-primary border-[1px] border-[#FE07DD] hover:bg-[#FE07DD] hover:text-black ${className}`}
        onClick={handleMint}
        disabled={isWritePending || isConfirming}
      >
        {isWritePending || isConfirming ? "Minting..." : `Mint ${label}`}
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
        <p className="text-xl text-green-500">Mint successful!</p>
      )}
    </div>
  );
};
