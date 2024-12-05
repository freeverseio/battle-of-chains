"use client";

import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useUserByAddress } from "@/hooks/useUserByAddress";
import {formatAddress} from "@/utils/formatAddress";

export const UserInfo = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  // Call the hook unconditionally
  const { loading, error, data } = useUserByAddress(address || "0x");
  const user = data?.userByAddress;

  // Handle connection states after all hooks have been called
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected || !address || address === "0x")
    return <div>Disconnected</div>;
  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error loading user data: {error.message}</div>;
  if (!user) return <div>No user data available.</div>;

  return (
    <Card className="border border-border card-background">
      <CardHeader>
        <CardTitle className="text-4xl">User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl">
            <span className="text-label">Name: </span>
            <span className="text-label-value">{user.name}</span>
          </p>
          <p className="hidden lg:block">
            <span className="text-3xl text-label">Address: </span>
            <span className="text-2xl text-label-value">{user.address}</span>
          </p>
          <p className="block lg:hidden">
            <span className="text-3xl text-label">Address: </span>
            <span className="text-3xl text-label-value">{formatAddress(user.address)}</span>
          </p>
          <p className="text-3xl">
            <span className="text-foreground">Homechain: </span>
            <span className="text-accent-foreground">{user.chain.name}</span>
          </p>
          <p className="text-3xl">
            <span className="text-label-secondary">Score: </span>
            <span className="text-label-secondary">{user.score}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
