"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

// Define the prop types explicitly
interface ProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-accent-foreground",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);

Progress.displayName = "Progress";

export { Progress };
