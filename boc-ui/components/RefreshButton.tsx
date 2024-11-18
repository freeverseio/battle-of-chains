import { Button } from "@/components/ui/button";
import { useUpdate } from "@/hooks/useUpdate";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface RefreshButtonProps {
  className?: string;
}

export const RefreshButton = ({ className }: RefreshButtonProps) => {
  const { update, isUpdating } = useUpdate();

  return (
    <Button
      variant="outline"
      onClick={update}
      disabled={isUpdating}
      className={`
        text-foreground text-xl border border-border
        hover:bg-gray-900 transition-all duration-200
        ${isUpdating ? "opacity-50" : ""}
        ${className}
      `}
    >
      <ArrowPathIcon
        className={`h-5 w-5 mr-1 ${isUpdating ? "animate-spin" : ""}`}
      />
      {isUpdating ? "Refreshing..." : "Refresh"}
    </Button>
  );
};
