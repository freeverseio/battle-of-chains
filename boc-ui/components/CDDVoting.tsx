"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChainActionType, AttackArea, optionsMap } from "@/utils/enums";
import SubmitVoteButton from "@/components/SubmitVoteButton";
import { ChainActionProposals } from "./ChainActionProposals";
import { chainIdMapping } from "@/utils/chainIdMapping";
import { useUserByAddress } from "@/hooks/useUserByAddress";

import Modal from "./Modal";

interface CDDVotingProps {
  treasury: number;
}

export default function CDDVoting({ treasury }: CDDVotingProps) {
  const { address } = useAccount();
  const { data: userData, loading } = useUserByAddress(address || "0x");

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [targetChain, setTargetChain] = useState<number>(0);
  const [attackArea, setAttackArea] = useState<AttackArea>(AttackArea.NULL);
  const [attackAddress, setAttackAddress] = useState<`0x${string}`>(
    "0x0000000000000000000000000000000000000000"
  );
  const [comment, setComment] = useState<string>("");

  // Get homechain from user data
  const homeChain = userData?.userByAddress?.chain?.chainId;

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Card className="card-background border bg-transparent mb-4">
        {/* Added bg-transparent */}
        <CardHeader className="">
          <CardTitle className="text-4xl">
            Chain Daily Decision (CDD) Voting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/*} <p className="text-3xl mb-2">
            <span className="text-label">Voting Power:</span>
            <span className="text-label-value ml-2"> {treasury}</span>
          </p>*/}

          <div className="space-y-6">
            {/* Options Row */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Label className="text-label-secondary text-3xl md:w-32">
                Options:
              </Label>
              <Select
                onValueChange={(value) => {
                  setSelectedOption(value);
                  setTargetChain(0);
                  setAttackArea(AttackArea.NULL);
                  setAttackAddress(
                    "0x0000000000000000000000000000000000000000"
                  );
                }}
              >
                <SelectTrigger className="w-full md:w-[200px] bg-transparent border border-white text-2xl text-white focus:ring-0">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-black border text-2xl border-border">
                  <SelectItem
                    value="option1"
                    className="text-white text-2xl hover:text-accent-foreground"
                  >
                    Improve
                  </SelectItem>
                  <SelectItem
                    value="option2"
                    className="text-white text-2xl hover:text-accent-foreground"
                  >
                    Defend
                  </SelectItem>
                  <SelectItem
                    value="option3"
                    className="text-white text-2xl hover:text-accent-foreground"
                  >
                    Attack Area
                  </SelectItem>
                  <SelectItem
                    value="option4"
                    className="text-white text-2xl hover:text-accent-foreground"
                  >
                    Attack Address
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Chain Row */}
            {(selectedOption === "option3" || selectedOption === "option4") && (
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="text-foreground text-2xl md:w-32">
                  Target Chain:
                </Label>
                <Select
                  onValueChange={(value) => setTargetChain(Number(value))}
                >
                  <SelectTrigger className="w-full md:w-[200px] bg-transparent border border-border text-foreground text-2xl focus:ring-0">
                    <SelectValue placeholder="Select a chain" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border border-border">
                    {Object.entries(chainIdMapping).map(
                      ([chainName, chainId]) => (
                        <SelectItem
                          key={chainId}
                          value={chainId.toString()}
                          className="text-white text-2xl hover:bg-accent-foreground"
                        >
                          {chainName}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Attack Area Row */}
            {selectedOption === "option3" && (
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="text-foreground text-2xl md:w-32">
                  Attack Area:
                </Label>
                <Select onValueChange={(value) => setAttackArea(Number(value))}>
                  <SelectTrigger className="w-full md:w-[200px] bg-transparent border border-border text-foreground text-2xl focus:ring-0">
                    <SelectValue placeholder="Select an area" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border border-border">
                    <SelectItem
                      value={AttackArea.NORTH.toString()}
                      className="text-white text-2xl hover:bg-accent-foreground"
                    >
                      North
                    </SelectItem>
                    <SelectItem
                      value={AttackArea.SOUTH.toString()}
                      className="text-white text-2xl hover:bg-accent-foreground"
                    >
                      South
                    </SelectItem>
                    <SelectItem
                      value={AttackArea.EAST.toString()}
                      className="text-white text-2xl hover:bg-accent-foreground"
                    >
                      East
                    </SelectItem>
                    <SelectItem
                      value={AttackArea.WEST.toString()}
                      className="text-white text-2xl hover:bg-accent-foreground"
                    >
                      West
                    </SelectItem>
                    <SelectItem
                      value={AttackArea.ALL.toString()}
                      className="text-white text-2xl hover:bg-accent-foreground"
                    >
                      All
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Attack Address Row */}
            {selectedOption === "option4" && (
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="text-foreground text-2xl md:w-32">
                  Attack Address:
                </Label>
                <input
                  type="text"
                  value={attackAddress}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith("0x")) {
                      setAttackAddress(value as `0x${string}`);
                    }
                  }}
                  className="w-full md:w-[500px] bg-white text-2xl bg-opacity-10 border border-border rounded p-2 text-foreground outline-none"
                />
              </div>
            )}

            {/* Comment Row */}
            <div className="space-y-2">
              <Label className="text-3xl text-foreground">
                Comment (optional)
              </Label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 bg-white bg-opacity-10 border border-border text-2xl rounded p-2 text-white  resize-none focus:ring-0 outline-none"
              />
            </div>

            {/* Submit Button */}
            <SubmitVoteButton
              selectedOption={selectedOption}
              targetChain={targetChain}
              attackArea={attackArea}
              attackAddress={attackAddress}
              comment={comment}
              homeChain={homeChain}
            />
          </div>
        </CardContent>
      </Card>
      <ChainActionProposals />
      <Modal />
    </>
  );
}
