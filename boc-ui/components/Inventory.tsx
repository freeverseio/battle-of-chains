"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UpgradeButton } from "./UpgradeButton";
import { MultichainMintButton } from "./MintButton";
import { UserArmy } from "./UserArmy";

interface Troop {
  name: string;
  requiredLevel: number;
  type: number; // 0 for attack, 1 for defense
}

interface Forge {
  name: string;
  level: number;
  upgradeCost: number;
  troops: Troop[];
}

export default function GamePage() {
  const [attackingForge, setAttackingForge] = useState<Forge>({
    name: "Attacking Forge",
    level: 1,
    upgradeCost: 100,
    troops: [{ name: "Type O", type: 0, requiredLevel: 1 }],
  });

  const [defenseForge, setDefenseForge] = useState<Forge>({
    name: "Defense Forge",
    level: 1,
    upgradeCost: 100,
    troops: [{ name: "Type 1", type: 1, requiredLevel: 1 }],
  });

  const [attackTroop, setAttackTroop] = useState<Troop | null>(null);
  const [defenseTroop, setDefenseTroop] = useState<Troop | null>(null);

  const handleCreateTroop = (troop: Troop) => {
    if (troop.type === 0) {
      if (!attackTroop) {
        setAttackTroop(troop);
        alert(`${troop.name} added as attack troop.`);
      } else {
        alert("Only one attack troop can be created at a time.");
      }
    } else if (troop.type === 1) {
      if (!defenseTroop) {
        setDefenseTroop(troop);
        alert(`${troop.name} added as defense troop.`);
      } else {
        alert("Only one defense troop can be created at a time.");
      }
    }
  };

  const ForgeComponent = ({
    forge,
    setForge,
  }: {
    forge: Forge;
    setForge: React.Dispatch<React.SetStateAction<Forge>>;
  }) => (
    <Card className="border border-border w-full md:w-[calc(50%-0.5rem)] card-background">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center">
          <CardTitle className=" text-4xl m-0">{forge.name}</CardTitle>
        </div>
        <div className="flex items-center">
          {/*<UpgradeButton
            className="mr-2 mb-2 text-xl"
            buildingType="Teleporter"
          />*/}
        </div>
      </CardHeader>

      <CardContent>
        {/* <p className="text-label-secondary text-3xl mb-2">
          Level: {forge.level}
        </p>
        <p className="text-3xl mb-2">
          <span className="text-label">Upgrade Cost:</span>
          <span className="text-label-value ml-2"> {forge.upgradeCost}</span>
        </p>
     */}
        <div>
          {forge.troops.map((troop) =>
            forge.level >= troop.requiredLevel ? (
              <MultichainMintButton
                key={troop.name}
                className="mr-2 mb-2 text-xl"
                type={troop.type}
                label={troop.name}
              />
            ) : (
              <Button
                key={troop.name}
                disabled
                className="mr-2 mb-2 text-xl border-[1px] border-muted text-[#D2B48C] hover:bg-[#A0522D] "
              >
                Mint {troop.name} (Requires Level {troop.requiredLevel})
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 ">
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <ForgeComponent forge={attackingForge} setForge={setAttackingForge} />
        <ForgeComponent forge={defenseForge} setForge={setDefenseForge} />
      </div>

      <UserArmy />
    </div>
  );
}
