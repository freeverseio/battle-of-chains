"use client";

import { useContext } from "react";
import { FaRegEye } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ModalContext } from "@/context/ModalContext";
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
    <div className="absolute -top-[0.1px] right-14 transform translate-x-1/2 -translate-y-1/2">
      {address && (
        <TooltipProvider delayDuration={80}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`${process.env.NEXT_PUBLIC_LAOS_APPS_URL}/asset/${chainId}/${address}/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-background border border-white text-foreground rounded-full p-1">
                  <FaRegEye size={16} />
                </div>
              </a>
            </TooltipTrigger>
            <TooltipContent className="text-lg" side="top">
              View Asset
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
