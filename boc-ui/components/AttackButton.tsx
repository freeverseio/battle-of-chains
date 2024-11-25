import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";
import { ModalContext } from "@/context/ModalContext";
import { useUpdate } from "@/hooks/useUpdate";
import { useRefetchState } from "@/hooks/useRefetchState";
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
  const {
    attack,
    hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
  } = useBattleOfChains();
  const { openModal, setModalState, setModalError } = useContext(ModalContext);
  const { refetchAll } = useRefetchState();
  const { update } = useUpdate();

  const handleAttack = async () => {
    openModal(async () => {
      setModalState("pending_signature");
      try {
        const strategy = 1; // Default strategy
        await attack(tokenIds, targetAddress, targetChain, strategy);
      } catch (err) {
        console.error("Error:", err);
        setModalState("transaction_error");
      }
    }, "attack_confirm");
  };

  useEffect(() => {
    const performUpdateAndRefetch = async () => {
      if (isConfirmed) {
        setModalState("transaction_attack_success");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await update();
        await new Promise((resolve) => setTimeout(resolve, 4000));
        refetchAll();
       
      } else if (writeError) {
        console.error(writeError);
        setModalError(writeError.message);
        setModalState("transaction_error");
      } else if (!isWritePending && hash) {
        setModalState("attacking");
      }
    };
    performUpdateAndRefetch();
  }, [hash, isWritePending, isConfirmed, writeError, setModalState]);

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
    </div>
  );
};
