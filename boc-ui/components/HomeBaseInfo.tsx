import React from "react";
import { useAccount } from "wagmi";
import { useUserByAddress } from "../hooks/useUserByAddress";
import { useAllInfos } from "../hooks/useAllInfos";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { tooltips } from "@/constants/tooltips";
import { UpgradeButton } from "./UpgradeButton";


const HomeBaseInfo: React.FC = () => {
  const { address } = useAccount();
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useUserByAddress(address || "0x");
  const {
    loading: infoLoading,
    error: infoError,
    data: infoData,
  } = useAllInfos();
  const user = userData?.userByAddress;

  if (userLoading || infoLoading) return <p>Loading...</p>;
  if (userError || infoError) return <p>Error loading data.</p>;
  if (!userData || !infoData) return <p>No data available.</p>;

  // Create a dictionary from the infoData
  const infoDict: { [key: string]: number[] } = {};
  infoData.allInfos.nodes.forEach((node: any) => {
    infoDict[node.key] = JSON.parse(node.value) as number[];
  });
  const currentLevel = parseInt(userData.userByAddress?.level);
  const currentXp = parseInt(userData.userByAddress?.xp);

  const xpPerLevel = infoDict["HOMEBASE_XP_PER_LEVEL"];
  const costPerLevel = infoDict["HOMEBASE_COST_PER_LEVEL"];
  const productionRatePerLevel = infoDict["HOMEBASE_DAILY_PRODUCTION_RATE"];

  const treasuryRequiredPerXpUnit = 1;
  if (!xpPerLevel || !costPerLevel || !productionRatePerLevel) {
    return <p>Required info not available.</p>;
  }
  // Ensure we don't exceed array bounds
  const maxLevel = xpPerLevel.length - 1;
  const nextLevel = Math.min(currentLevel + 1, maxLevel);

  const xpForNextLevel = xpPerLevel[nextLevel] || 0;

  const productionRate = productionRatePerLevel[currentLevel] || 0;

  const xpNeededForNextLevel = xpForNextLevel - currentXp;
  const costNeededForNextLevel =
    xpNeededForNextLevel * treasuryRequiredPerXpUnit;

    return (
      <Card className="border border-border card-background">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-4xl">Home Base</CardTitle>
              <TooltipProvider>
                {tooltips.homeBase && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-5 w-5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltips.homeBase}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
            <UpgradeButton tokenId={"0"} chainId={user?.chain?.chainId} />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-3xl">
              <span className="text-label-secondary">Level: </span>
              <span className="text-label-secondary">{currentLevel}</span>
            </p>
            <p className="text-3xl">
              <span className="text-foreground">XP: </span>
              <span className="text-foreground">{currentXp}</span>
            </p>
          </div>
        </CardHeader>
  
        <CardContent>
          <div className="space-y-2">

          <p className="text-3xl">
              <span className="text-label">XP Needed for Next Level: </span>
              <span className="text-label-value">{xpNeededForNextLevel}</span>
            </p>
            <p className="text-3xl">
              <span className="text-label">Daily Production Rate: </span>
              <span className="text-label-value">{productionRate}</span>
            </p>
            <p className="text-3xl">
              <span className="text-label">Cost of 1 XP: </span>
              <span className="text-label-value">{treasuryRequiredPerXpUnit}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };


export default HomeBaseInfo;
