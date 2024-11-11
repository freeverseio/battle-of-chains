"use client";

import { Button } from "@/components/ui/button";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";
import {
  ChainAction,
  ChainActionType,
  AttackArea,
  optionsMap,
} from "@/utils/enums";
import { ethers, isAddress } from "ethers";

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
  const { voteChainAction, isConfirming, isConfirmed, writeError } =
    useBattleOfChains();

  const handleVote = async () => {
    console.log("selectedOption", selectedOption);
    if (!selectedOption) return;

    const chainActionParams = optionsMap[selectedOption];
    const actionType = chainActionParams.actionType;

    let chainAction: ChainAction = {
      targetChain: 0,
      actionType: actionType,
      attackArea: AttackArea.NULL,
      attackAddress: "0x0000000000000000000000000000000000000000",
    };

    if (
      actionType === ChainActionType.IMPROVE ||
      actionType === ChainActionType.DEFEND
    ) {
      // No additional parameters needed
    } else if (actionType === ChainActionType.ATTACK_AREA) {
      if (targetChain === 0) {
        alert("Please select a target chain different from 0");
        return;
      }
      if (targetChain === homeChain) {
        alert("Target chain cannot be your home chain");
        return;
      }
      if (attackArea === AttackArea.NULL) {
        alert("Please select an attack area");
        return;
      }
      chainAction.targetChain = targetChain;
      chainAction.attackArea = attackArea;
    } else if (actionType === ChainActionType.ATTACK_ADDRESS) {
      if (targetChain === 0) {
        alert("Please select a target chain different from 0");
        return;
      }
      if (targetChain === homeChain) {
        alert("Target chain cannot be your home chain");
        return;
      }
      if (!isAddress(attackAddress)) {
        alert("Please enter a valid attack address");
        return;
      }
      chainAction.targetChain = targetChain;
      chainAction.attackAddress = attackAddress;
    }

    try {
      voteChainAction(chainAction, comment);
    } catch (error: any) {
      console.error("Voting failed:", error);
    }
  };

  return (
    <>
      <Button
        onClick={handleVote}
        disabled={!selectedOption || isConfirming}
        className={`bg-primary border-[1px] border-[#FE07DD] hover:bg-[#FE07DD] hover:text-black text-2xl ${className}`}
      >
        {isConfirming ? "Voting. Awaiting finality..." : "Submit Vote"}
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
        <p className="text-green-500 text-2xl">Vote submitted successfully!</p>
      )}
    </>
  );
}
