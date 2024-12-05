"use client";

import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useUserLogs } from "@/hooks/useUserLogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { tooltips } from "@/constants/tooltips";
import { Info } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface Log {
  id: string;
  chain: string;
  comment: string;
  timestamp: string;
}

export const UserActivity = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { loading, error, data } = useUserLogs(address || "0x");
  const logs = data?.allLogs?.nodes || [];

  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected || !address || address === "0x")
    return <div>Disconnected</div>;
  if (loading) return <div>Loading activity data...</div>;
  if (error) return <div>Error loading activity data: {error.message}</div>;
  if (!logs.length) return <div>No activity data available.</div>;

  return (
    <Card className="border border-border card-background">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-4xl">User Activity</CardTitle>
          <TooltipProvider>
            {tooltips.userActivity && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltips.userActivity}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground text-2xl">Time</TableHead>
              <TableHead className="text-foreground text-2xl">
                Comment
              </TableHead>{" "}
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: Log) => (
              <TableRow key={log.id}>
                <TableCell className="text-label-secondary text-2xl">
                  {formatTimestamp(log.timestamp)}{" "}
                </TableCell>

                <TableCell className="text-muted-foreground text-2xl">
                  {log.comment}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
