"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";
import { ModalContext } from "@/context/ModalContext";
import Modal from "./Modal";

interface ChainSelectionProps {
  onJoinSuccess: () => void;
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
    hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
  } = useBattleOfChains();
  const { openModal, setModalState } = useContext(ModalContext);

  useEffect(() => {
    if (isConfirmed) {
      setModalState("transaction_join_success");
      onJoinSuccess();
    } else if (writeError) {
      setModalState("transaction_error");
    } else if (!isWritePending && hash) {
      setModalState("joining");
    }
  }, [
    isConfirmed,
    hash,
    writeError,
    isWritePending,
    onJoinSuccess,
    setModalState,
  ]);

  const handleJoin = async () => {
    if (!selectedChain) return;

    openModal(async () => {
      setModalState("pending_signature");
      try {
        await joinHomeChain(selectedChain, nickname);
      } catch (error) {
        console.error("Error joining home chain:", error);
        setModalState("transaction_error");
      }
    }, "join_confirm");
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
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${chain.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative flex flex-col items-center justify-center p-4">
                  <Image
                    src={chain.icon}
                    alt={chain.name}
                    width={150}
                    height={100}
                    className="w-32 h-32 md:w-48 md:h-48 lg:w-54 lg:h-54"
                  />
                  <p className="text-white text-center text-xl mt-4">
                    {chain.displayName}
                  </p>
                </div>
                <div className="absolute inset-0 border border-purple-500/50 rounded-lg group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all" />
              </div>
            </button>
          ))}
        </div>

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
          </div>
        )}
      </div>
      <Modal />
    </div>
  );
}
