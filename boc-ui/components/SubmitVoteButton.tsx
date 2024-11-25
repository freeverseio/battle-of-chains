"use client";

import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";
import { ModalContext } from "@/context/ModalContext";
import {
  ChainAction,
  ChainActionType,
  AttackArea,
  optionsMap,
} from "@/utils/enums";
import { ethers, isAddress } from "ethers";
import { useUpdate } from "@/hooks/useUpdate"; // Add this import
import { useRefetchState } from "@/hooks/useRefetchState";
interface SubmitVoteButtonProps {
  selectedOption: string | null;
  targetChain: number;
  attackArea: AttackArea;
  attackAddress: `0x${string}`;
  comment: string;
  homeChain: number;
  className?: string;
}

export default function SubmitVoteButton({
  selectedOption,
  targetChain,
  attackArea,
  attackAddress,
  comment,
  homeChain,
  className,
}: SubmitVoteButtonProps) {
  const {
    voteChainAction,
    hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
  } = useBattleOfChains();
  const { openModal, setModalState, setModalError } = useContext(ModalContext);
  const { update, isUpdating, error } = useUpdate();
  const { refetchAll } = useRefetchState();

  const handleVote = async () => {
    if (!selectedOption) return;

    const chainActionParams = optionsMap[selectedOption];
    const actionType = chainActionParams.actionType;

    let chainAction: ChainAction = {
      targetChain: 0,
      actionType: actionType,
      attackArea: AttackArea.NULL,
      attackAddress: "0x0000000000000000000000000000000000000000",
    };

    if (actionType === ChainActionType.ATTACK_AREA) {
      if (
        targetChain === 0 ||
        targetChain === homeChain ||
        attackArea === AttackArea.NULL
      ) {
        setModalState("transaction_error");
        return;
      }
      chainAction.targetChain = targetChain;
      chainAction.attackArea = attackArea;
    } else if (actionType === ChainActionType.ATTACK_ADDRESS) {
      if (
        targetChain === 0 ||
        targetChain === homeChain ||
        !isAddress(attackAddress)
      ) {
        setModalState("transaction_error");
        return;
      }
      chainAction.targetChain = targetChain;
      chainAction.attackAddress = attackAddress;
    }

    openModal(async () => {
      setModalState("pending_signature");
      try {
        await voteChainAction(chainAction, comment);
      } catch (error) {
        console.error("Error:", error);
        setModalState("transaction_error");
      }
    }, "vote_confirm");
  };
  // components/SubmitVoteButton.tsx
  useEffect(() => {
    const performUpdateAndRefetch = async () => {
      if (isConfirmed) {
        setModalState("transaction_vote_success");
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await update();
        await new Promise((resolve) => setTimeout(resolve, 4000));
        refetchAll();
       
      } else if (writeError) {
        console.error(writeError);
        setModalError(writeError.message);
        setModalState("transaction_error");
      } else if (!isWritePending && hash) {
        setModalState("voting");
      }
    };
    performUpdateAndRefetch();
  }, [hash, isWritePending, isConfirmed, writeError, setModalState]);

  return (
    <Button
      onClick={handleVote}
      disabled={!selectedOption || isConfirming}
      className={`bg-primary border-[1px] border-[#FE07DD] hover:bg-[#FE07DD] hover:text-black text-2xl ${className}`}
    >
      Submit Vote
    </Button>
  );
}
