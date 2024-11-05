// components/SummaryTable.tsx
"use client";

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
        <CardTitle className="text-4xl">Universe Summary</CardTitle>
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
                <TableCell className=" text-2xl">
                  <div>
                    <div className="text-white">
                      {log.userByUserAddress?.name || ""}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {log.userByUserAddress?.address
                        ? formatAddress(log.userByUserAddress.address)
                        : "-"}
                    </div>
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
