import { FC } from "react";
import { FiCopy } from "react-icons/fi";

interface PlayerTooltipProps {
  address: string;
  name: string;
  coordinates: [bigint, bigint];
  treasury: number;
}

export const PlayerTooltip: FC<PlayerTooltipProps> = ({
  address,
  name,
  coordinates,
  treasury,
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  const formattedAddress = `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  return (
    <div className="min-w-[200px] bg-[#12021c] rounded-lg border border-white p-4 select-none relative">
      <div className="space-y-4">
        <div className="gap-2">
          <div className="text-accent-foreground text-2xl truncate">{name}</div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xl truncate">
              {formattedAddress}
            </span>
            <FiCopy
              className="cursor-pointer hover:text-gray-300 text-white"
              onClick={() => copyToClipboard(address)}
              size={16}
            />
          </div>
          <div className="text-label text-xl">
            Soft Coins: <span className="text-label-value">{treasury}</span>
          </div>
        </div>
        <div className="flex gap-4"></div>
      </div>
    </div>
  );
};
