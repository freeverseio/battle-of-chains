"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAllLogs } from "@/hooks/useAllLogs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatTimestamp } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Info } from "lucide-react";
import { tooltips } from "@/constants/tooltips";

interface LogNode {
  chainByChain?: {
    name: string;
  };
  comment: string;
  userByUserAddress?: {
    name: string;
    address: string;
  };
  timestamp: string;
}

export const SummaryTable = () => {
  const [copiedRowIndex, setCopiedRowIndex] = useState<number | null>(null);

  const copyAddressToClipboard = async (address: string, index: number) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedRowIndex(index);
      // Clear the message after 2 seconds
      setTimeout(() => {
        setCopiedRowIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  const { loading, error, data } = useAllLogs();

  const logs = data?.allLogs?.nodes || [];

  // Handle states
  if (loading) return <div>Loading summary data...</div>;
  if (error) return <div>Error loading summary data: {error.message}</div>;
  if (!logs.length) return <div>No summary data available.</div>;

  // Format address function
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="border border-border card-background">
     <CardHeader>
  <div className="flex items-center gap-2">
    <CardTitle className="text-4xl">Universe Summary</CardTitle>
    <TooltipProvider>
      {tooltips.universeSummary && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-5 w-5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltips.universeSummary}</p>
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
              <TableHead className="text-foreground text-2xl">User</TableHead>
              <TableHead className="text-foreground text-2xl">
                Comment
              </TableHead>
              <TableHead className="text-foreground text-2xl">Chain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: LogNode, index: number) => (
              <TableRow key={index}>
                <TableCell className="text-label-secondary text-2xl">
                  {formatTimestamp(log.timestamp)}
                </TableCell>
                <TableCell className="text-2xl relative">
                  <div>
                    <div className="text-white">
                      {log.userByUserAddress?.name || ""}
                    </div>
                    <button
                      onClick={() =>
                        log.userByUserAddress?.address &&
                        copyAddressToClipboard(
                          log.userByUserAddress.address,
                          index
                        )
                      }
                      className="text-lg text-muted-foreground hover:underline cursor-pointer"
                    >
                      {log.userByUserAddress?.address
                        ? formatAddress(log.userByUserAddress.address)
                        : "-"}
                    </button>
                    {copiedRowIndex === index && (
                      <div className="absolute top-4 right-0 bg-black text-card-foreground px-2 py-1 rounded text-sm">
                        Copied to clipboard
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl">
                  {log.comment}
                </TableCell>
                <TableCell className="text-muted-foreground text-2xl">
                  {log.chainByChain?.name || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
