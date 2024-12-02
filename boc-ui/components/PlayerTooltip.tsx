import { FC } from 'react';
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
  return (
    <div className="min-w-[200px] bg-[#12021c] rounded-lg border border-white p-4">
      <div className="space-y-4">
        <div className="gap-2">
          <div className="text-accent-foreground text-2xl truncate">{name}</div>
          <div className="text-white text-xl truncate">{`${address?.slice(0, 6)}`}...{`${address?.slice(-4)}`}</div>
          <div className="text-label text-xl">
            Soft Coins: <span className="text-label-value">{treasury}</span>
          </div>
        </div>
        <div className="flex gap-4">

        </div>
      </div>
    </div>
  );
};
