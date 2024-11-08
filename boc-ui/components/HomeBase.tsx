"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import { UserInfo } from "./UserInfo";
import { UserActivity } from "./UserActivity";
import HomeBaseInfo from "@/components/HomeBaseInfo";
import Modal from "./Modal";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <UserInfo />
        <HomeBaseInfo />
      </div>
      <div className="mb-2">
        <UserActivity />
      </div>
      <Modal />
    </>
  );
}
