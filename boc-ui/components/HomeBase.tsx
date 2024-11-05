// HomeBase.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { UserInfo } from "./UserInfo";
import { UserActivity } from "./UserActivity";
import { useAccount } from "wagmi";
import { SoftCoinProduction } from "@/components/SoftCoinProduction"; // Import the new component

// Dynamically import Progress with ssr: false
const Progress = dynamic(
  () => import("@/components/ui/progress").then((mod) => mod.Progress),
  {
    ssr: false,
  }
);

export default function HomeBase() {
  const [coinFactoryHealth, setCoinFactoryHealth] = useState(100);
  const [teleporterHealth, setTeleporterHealth] = useState(100);
  const [productionRate, setProductionRate] = useState(10);
  const { address } = useAccount();

  if (!address) {
    return <div className="text-3xl">Please connect your wallet</div>;
  }
  return (
    <>
      <div className="mb-2">
        <UserInfo />
      </div>
      <div className="mb-2">
        <UserActivity />
      </div>
    </>
  );
}
