// components/UpgradeButton.tsx
"use client";

import { useEffect, useState, useContext } from "react";
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
  className?: string;
}

export function UpgradeButton({
  tokenId,
  chainId,
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

  const { areButtonsDisabled, openModal, setModalState } =
    useContext(ModalContext);

  const handleUpgrade = () => {
    openModal(async () => {
      setModalState("pending_signature");
      try {
        await upgrade(chainId, tokenId);
        // Transaction initiated successfully
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
      console.log(writeError);
      setModalState("transaction_error");
    } else if (!isWritePending && hash) {
      setModalState("upgrading");
    }
  }, [hash, isWritePending, isConfirmed, writeError, setModalState]);

  // Corrected return statement
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
    <div className="absolute -top-2 right-6 transform translate-x-1/2 -translate-y-1/2">
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
    </div>
  );
}
