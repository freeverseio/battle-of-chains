
"use client";

import { FaRegEye } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { chainIdTouERC721Address } from "@/utils/chainIdMapping";

interface AssetViewerButtonProps {
  tokenId: string;
  chainId: number;
  className?: string;
}

export function AssetViewerButton({
  tokenId,
  chainId,
  className,
}: AssetViewerButtonProps) {
  const address = chainIdTouERC721Address[chainId];

  if (!address) {
    console.error(`No address found for chain ID: ${chainId}`);
    return null;
  }

  return (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={`${process.env.NEXT_PUBLIC_LAOS_APPS_URL}/asset/${chainId}/${address}/${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-background text-foreground border border-white rounded-full p-[4px]">
              <FaRegEye size={17} />
            </div>
          </a>
        </TooltipTrigger>
        <TooltipContent className="text-lg" side="top">
          View Asset
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
