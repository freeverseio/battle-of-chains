// components/DeadAsset.tsx
"use client";

import { IoSkull } from "react-icons/io5";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function DeadAsset() {
  return (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-[#FE07DD] bg-background border border-white rounded-full p-[5px]">
            <IoSkull size={15} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-lg" side="top">
          Dead Asset
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
