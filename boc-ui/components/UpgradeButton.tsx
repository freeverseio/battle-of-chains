"use client";

import { useEffect, useContext } from "react";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";
import { FaArrowAltCircleUp } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ModalContext } from "@/context/ModalContext";
import { Button } from "./ui/button";
interface UpgradeButtonProps {
  tokenId: string;
  chainId: number;
  areButtonsDisabled?: boolean;
  className?: string;
}

export function UpgradeButton({
  tokenId,
  chainId,
  areButtonsDisabled,
  className,
}: UpgradeButtonProps) {
  const {
    upgrade,
    hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
  } = useBattleOfChains();

  const { openModal, setModalState, setModalError } = useContext(ModalContext);

  const handleUpgrade = () => {
    openModal(async () => {
      setModalState("pending_signature");
      try {
        await upgrade(chainId, tokenId);
      } catch (err) {
        console.error("Error:", err);
        setModalState("transaction_error");
      }
    }, "upgrade_confirm");
  };

  useEffect(() => {
    if (isConfirmed) {
      setModalState("transaction_upgrade_success");
    } else if (writeError) {
      console.error(writeError);
      setModalError(writeError.message);
      setModalState("transaction_error");
    } else if (!isWritePending && hash) {
      setModalState("upgrading");
    }
  }, [hash, isWritePending, isConfirmed, writeError, setModalState]);

  return tokenId === "0" ? (
    <Button
      onClick={handleUpgrade}
      disabled={areButtonsDisabled}
      variant="default"
      className={`${
        areButtonsDisabled ? "opacity-50 cursor-not-allowed" : ""
      } `}
    >
      Upgrade
    </Button>
  ) : (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleUpgrade}
            disabled={areButtonsDisabled}
            className={`${
              areButtonsDisabled ? "opacity-50 cursor-not-allowed" : ""
            } bg-[#4DAA98] border border-white text-background rounded-full`}
          >
            <FaArrowAltCircleUp size={24} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="text-lg" side="top">
          Upgrade
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
