"use client";

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useChainActionProposals } from "@/hooks/useChainActionProposals";
import { ChainActionType, AttackArea, ChainAction } from "@/utils/enums";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Info } from "lucide-react";
import { tooltips } from "@/constants/tooltips";
interface ChainActionProposal {
  attackAddress: `0x${string}`;
  attackArea: AttackArea | null;
  type: ChainActionType;
  votes: number;
  chainByTargetChainId: {
    name: string;
  } | null;
  chainBySourceChainId: {
    name: string;
  };
}

const getActionTypeLabel = (type: ChainActionType): string => {
  return ChainActionType[type];
};

const getAttackAreaLabel = (area: AttackArea): string => {
  return AttackArea[area];
};

const formatAddress = (address: `0x${string}`): string => {
  return address === "0x0000000000000000000000000000000000000000"
    ? "None"
    : `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ProposalCard = ({ proposal }: { proposal: ChainActionProposal }) => {
  const actionType = getActionTypeLabel(proposal.type);
  const shouldShowAttackArea =
    proposal.type === ChainActionType.ATTACK_AREA &&
    proposal.attackArea !== AttackArea.NULL;

  const shouldShowAttackAddress =
    proposal.type === ChainActionType.ATTACK_ADDRESS &&
    proposal.attackAddress !== "0x0000000000000000000000000000000000000000";

  const isAttackAction =
    proposal.type === ChainActionType.ATTACK_AREA ||
    proposal.type === ChainActionType.ATTACK_ADDRESS;

  return (
    <Card className="border border-border p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-xl">Action Type:</span>
          <span className="text-foreground font-medium">{actionType}</span>
        </div>

        {isAttackAction && proposal.chainByTargetChainId && (
          <div className="flex justify-between items-center text-xl">
            <span className="text-muted-foreground">Target Chain:</span>
            <span className="text-foreground">
              {proposal.chainByTargetChainId.name}
            </span>
          </div>
        )}

        {shouldShowAttackArea && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xl">Attack Area:</span>
            <span className="text-foreground text-xl">
              {getAttackAreaLabel(proposal.attackArea as AttackArea)}
            </span>
          </div>
        )}

        {shouldShowAttackAddress && (
          <div className="flex justify-between items-center text-xl">
            <span className="text-muted-foreground">Target Address:</span>
            <span className="text-foreground">
              {formatAddress(proposal.attackAddress)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-border pt-2 mt-2 ">
          <span className="text-label text-2xl">Votes:</span>
          <span className="text-label-value font-bold text-2xl">
            {proposal.votes}
          </span>
        </div>
      </div>
    </Card>
  );
};

export const ChainActionProposals = () => {
  const { loading, error, data } = useChainActionProposals();

  if (loading) return <div>Loading proposals...</div>;
  if (error) return <div>Error loading proposals: {error.message}</div>;

  const proposals = data?.allChainActionProposals?.nodes || [];
  const totalCount = data?.allChainActionProposals?.totalCount || 0;

  // Group proposals by source chain
  const proposalsByChain: Record<string, ChainActionProposal[]> =
    proposals.reduce(
      (
        acc: Record<string, ChainActionProposal[]>,
        proposal: ChainActionProposal
      ) => {
        const chainName = proposal.chainBySourceChainId.name;
        if (!acc[chainName]) {
          acc[chainName] = [];
        }
        acc[chainName].push(proposal);
        return acc;
      },
      {}
    );

  return (
    <Card className="border border-border card-background">
      <CardHeader>
      <div className="flex items-center gap-2">
        <CardTitle className="text-4xl">Chain Action Proposals ({totalCount})</CardTitle>
        <TooltipProvider>
          {tooltips.chainActionProposals && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltips.chainActionProposals}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(proposalsByChain).map(
            ([chainName, chainProposals]) => {
              // Group proposals by type within each chain
              const proposalsByType = chainProposals.reduce(
                (acc: { [key: string]: ChainActionProposal[] }, proposal) => {
                  const type = getActionTypeLabel(proposal.type);
                  if (!acc[type]) {
                    acc[type] = [];
                  }
                  acc[type].push(proposal);
                  return acc;
                },
                {}
              );

              return (
                <div key={chainName} className="space-y-4">
                  <h3 className="text-3xl text-label-secondary font-semibold">
                    {chainName}
                  </h3>
                  {Object.entries(proposalsByType).map(([type, proposals]) => (
                    <div key={type} className="space-y-2">
                      <h4 className="text-2xl text-foreground">
                        {type} ({proposals.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {proposals.map((proposal, index) => (
                          <ProposalCard key={index} proposal={proposal} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
};
