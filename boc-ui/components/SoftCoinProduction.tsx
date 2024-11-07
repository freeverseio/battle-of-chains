// SoftCoinProduction.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UpgradeButton } from "@/components/UpgradeButton"; // Adjust the path as needed

interface SoftCoinProductionProps {
  coinFactoryHealth: number;
  softCoinBalance: number;
  productionRate: number;
}

export function SoftCoinProduction({
  coinFactoryHealth,
  softCoinBalance,
  productionRate,
}: SoftCoinProductionProps) {
  return (
    <Card className="md:col-span-2 border border-border card-background">
      <CardHeader>
        <CardTitle className="text-4xl">Soft Coin Production</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={coinFactoryHealth} className="mb-2" />
        <p className="text-foreground text-2xl">Health: {coinFactoryHealth}%</p>
        <p className="text-3xl mb-2">
          <span className="text-label">Soft Coins:</span>
          <span className="text-label-value ml-2"> {softCoinBalance}</span>
        </p>
        <p className="text-foreground text-2xl mb-2">
          Production Rate: {productionRate} coins/min
        </p>
        {/*<UpgradeButton />*/}
      </CardContent>
    </Card>
  );
}
