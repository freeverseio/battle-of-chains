// components/AttackButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";

interface AttackButtonProps {
  targetAddress: `0x${string}`;
  targetChain: number;
  tokenIds: string[];
  className?: string;
}

export const AttackButton: React.FC<AttackButtonProps> = ({
  targetAddress,
  targetChain,
  tokenIds,
  className,
}) => {
  const { attack, isConfirming, isConfirmed, isWritePending, writeError } =
    useBattleOfChains();

  const handleAttack = async () => {
    try {
      const strategy = 1; // Default strategy
      attack(tokenIds, targetAddress, targetChain, strategy);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="destructive"
        size="lg"
        className={`bg-black hover:bg-gray-900 text-white border border-red-500 
          hover:border-red-600 transition-all duration-200 text-xl ${className}`}
        onClick={handleAttack}
        disabled={isWritePending || isConfirming}
      >
        {isWritePending
          ? "Attacking..."
          : isConfirming
          ? "Confirming..."
          : "Attack"}
      </Button>
      {(isWritePending || isConfirming) && (
        <div className="text-muted-foreground">Waiting for confirmation...</div>
      )}
      {isConfirmed && <p className="text-green-500">Attack confirmed!</p>}
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
    </div>
  );
};
