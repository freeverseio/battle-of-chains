// components/ChainSelection.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";

interface ChainSelectionProps {
  onJoinSuccess: () => void;
}
{
  /*const CHAIN_OPTIONS = [
  {
    id: 1,
    name: "Ethereum",
    displayName: "Ethereum Foundation",
    icon: "/logos/ethereum.svg",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 137,
    name: "Polygon",
    displayName: "Polygon Chain",
    icon: "/logos/polygon.svg",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: 56,
    name: "Binance",
    displayName: "Binance Chain",
    icon: "/logos/binance.svg",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: 42161,
    name: "Arbitrum",
    displayName: "Arbitrum Chain",
    icon: "/logos/arbitrum.svg",
    color: "from-teal-400 to-teal-600",
  },
];*/
}
const CHAIN_OPTIONS = [
  {
    id: 1,
    name: "Ethereum",
    displayName: "Ethereum",
    icon: "/logos/ethereum.svg",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 137,
    name: "Polygon",
    displayName: "Polygon",
    icon: "/logos/polygon.svg",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: 42161,
    name: "Arbitrum",
    displayName: "Arbitrum",
    icon: "/logos/arbitrum.svg",
    color: "from-teal-400 to-teal-600",
  },
];

export function ChainSelection({ onJoinSuccess }: ChainSelectionProps) {
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");
  const {
    joinHomeChain,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
  } = useBattleOfChains();

  useEffect(() => {
    if (isConfirmed) {
      // Call the callback function to inform the parent component
      onJoinSuccess();
    }
  }, [isConfirmed, onJoinSuccess]);

  const handleJoin = async () => {
    if (!selectedChain) return;
    try {
      await joinHomeChain(selectedChain, nickname);
    } catch (error) {
      console.error("Error joining home chain:", error);
    }
  };
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-6xl font-bold text-white mb-6 pixel-text">
          Battle of Chains
        </h1>

        <h2 className="text-center text-3xl text-white mb-8">
          Choose your Home Chain
        </h2>

        {/* Flex container for chain options with wrapping */}
        <div className="flex flex-wrap justify-center items-center gap-6 px-4">
          {CHAIN_OPTIONS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => setSelectedChain(chain.id)}
              className={`relative group ${
                selectedChain === chain.id
                  ? "ring-2 ring-purple-500 rounded"
                  : ""
              }`}
            >
              <div className="relative overflow-hidden rounded-lg border-2 border-purple-500/30 bg-black">
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${chain.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                />

                {/* Chain Icon */}
                <div className="relative flex flex-col items-center justify-center p-4">
                  <Image
                    src={chain.icon}
                    alt={chain.name}
                    width={150} // Base size
                    height={100}
                    className="w-32 h-32 md:w-48 md:h-48 lg:w-54 lg:h-54" // Responsive sizes
                  />
                  <p className="text-white text-center text-xl mt-4">
                    {chain.displayName}
                  </p>
                </div>

                {/* Neon Border Effect */}
                <div className="absolute inset-0 border border-purple-500/50 rounded-lg group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all" />
              </div>
            </button>
          ))}
        </div>

        {/* Input and Join Button (only show if chain is selected) */}
        {selectedChain && (
          <div className="mt-8 max-w-md mx-auto space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white text-3xl placeholder-purple-300/50 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleJoin}
              disabled={!nickname || isWritePending}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg text-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isWritePending || isConfirming
                ? "Joining..."
                : "Join Home Chain"}
            </button>
            {writeError && (
              <>
                <p className="text-red-500 text-xl">
                  {writeError.message.toLowerCase().includes("user rejected")
                    ? "Signature rejected by user"
                    : "Oops, something went wrong"}
                </p>
                {console.error(writeError.message)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
