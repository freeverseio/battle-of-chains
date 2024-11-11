// components/GlobalMap.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GiCastle, GiTeleport, GiBowman, GiBroadsword } from "react-icons/gi";
import { FaCoins, FaShieldAlt } from "react-icons/fa";
import { AttackButton } from "./AttackButton";
import { useAccount } from "wagmi";
import {
  useBattleOfChains,
  useHasHomeChain,
  useCoordinatesOf,
  useHomeChainOf,
} from "@/hooks/useBattleOfChains";
import { ChainSelection } from "./ChainSelection";

interface Blockchain {
  name: string;
  x: number;
  y: number;
}

const chainIdMapping: Record<string, number> = {
  Ethereum: 1,
  Binance: 56,
  Polygon: 137,
  Arbitrum: 42161,
};

const blockchains: Blockchain[] = [
  { name: "Ethereum", x: 25, y: 25 },
  { name: "Binance", x: 75, y: 25 },
  { name: "Polygon", x: 25, y: 75 },
  { name: "Arbitrum", x: 75, y: 75 },
];

const players = [
  {
    name: "Player 1",
    address: "0x46Ba7Fc089ceCd37F5ce79dBe372d1A9BF020b1e", // Replace with actual address
    homeChainId: chainIdMapping["Ethereum"],
    bases: [
      {
        chainId: chainIdMapping["Ethereum"],
        x: 20,
        y: 20,
      },
      {
        chainId: chainIdMapping["Binance"],
        x: 70,
        y: 20,
      },
      {
        chainId: chainIdMapping["Polygon"],
        x: 20,
        y: 70,
      },
      {
        chainId: chainIdMapping["Arbitrum"],
        x: 70,
        y: 70,
      },
    ],
    troops: { archers: 10, warriors: 15 },
    defense: 50,
    treasury: 1000,
  },
  {
    name: "Player 2",
    address: "0x17b1833fDB02148229764C70137132DA89E27122", // Replace with actual address
    homeChainId: chainIdMapping["Binance"],
    bases: [
      {
        chainId: chainIdMapping["Binance"],
        x: 80,
        y: 35,
      },
      {
        chainId: chainIdMapping["Ethereum"],
        x: 30,
        y: 35,
      },
      {
        chainId: chainIdMapping["Polygon"],
        x: 30,
        y: 80,
      },
      {
        chainId: chainIdMapping["Arbitrum"],
        x: 80,
        y: 80,
      },
    ],
    troops: { archers: 8, warriors: 12 },
    defense: 40,
    treasury: 800,
  },
  {
    name: "Player 3",
    address: "0x22F7024D711C4E791c8D134E0c3779ED907561f9", // Replace with actual address
    homeChainId: chainIdMapping["Polygon"],
    bases: [
      {
        chainId: chainIdMapping["Polygon"],
        x: 10,
        y: 90,
      },
      {
        chainId: chainIdMapping["Ethereum"],
        x: 10,
        y: 40,
      },
      {
        chainId: chainIdMapping["Binance"],
        x: 60,
        y: 40,
      },
      {
        chainId: chainIdMapping["Arbitrum"],
        x: 60,
        y: 90,
      },
    ],
    troops: { archers: 12, warriors: 10 },
    defense: 45,
    treasury: 900,
  },
];

export default function GlobalMap() {
  const { address } = useAccount();
  const {
    data: coordinatesOf,
    isLoading: isLoadingHasCoordinatesOf,
    error: coordinatesOfError,
  } = useCoordinatesOf(address);
  const {
    data: hasChain,
    isLoading: isLoadingHasHomeChain,
    error: hasHomeChainError,
  } = useHasHomeChain(address);
  const {
    data: homeChainOf,
    isLoading: isLoadingHomeChainOf,
    error: homeChainOfError,
  } = useHomeChainOf(address);

  const [isLoading, setIsLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleJoinSuccess = () => {
    setHasJoined(true);
  };

  useEffect(() => {
    if (isLoadingHasHomeChain) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setHasJoined(!!hasChain);
    }
  }, [isLoadingHasHomeChain, hasChain]);

  useEffect(() => {
    if (Array.isArray(coordinatesOf) && coordinatesOf[0] && coordinatesOf[1]) {
      const normalizedX = normalizeCoordinate(coordinatesOf[0]);
      const normalizedY = normalizeCoordinate(coordinatesOf[1]);
      setUserCoordinates({ x: normalizedX, y: normalizedY });
    }
  }, [coordinatesOf]);

  if (!address) {
    return <div className="text-3xl">Please connect your wallet</div>;
  }

  if (isLoading) {
    return <div className="text-3xl"></div>;
  }

  if (!hasJoined) {
    return <ChainSelection onJoinSuccess={handleJoinSuccess} />;
  }

  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom[0]);
  };

  const toggleTooltip = (tooltipId: string) => {
    setOpenTooltip((prevTooltip) =>
      prevTooltip === tooltipId ? null : tooltipId
    );
  };

  function normalizeCoordinate(value: bigint): number {
    const max80BitValue = BigInt("1208925819614629174706175"); // 2^80 - 1

    // Now both values are bigint type
    const percentage = (value * BigInt(100)) / max80BitValue;

    return Number(percentage);
  }

  const renderUserMarker = () => {
    if (!userCoordinates) return null;

    const positions = [
      { left: userCoordinates.x / 2, top: userCoordinates.y / 2 }, // Top-left quadrant
      { left: 50 + userCoordinates.x / 2, top: userCoordinates.y / 2 }, // Top-right quadrant
      { left: userCoordinates.x / 2, top: 50 + userCoordinates.y / 2 }, // Bottom-left quadrant
      { left: 50 + userCoordinates.x / 2, top: 50 + userCoordinates.y / 2 }, // Bottom-right quadrant
    ];

    return positions.map((pos, index) => (
      <div
        key={`user-marker-${index}`}
        className="absolute bg-green-500 rounded-full p-2 cursor-pointer"
        style={{
          left: `${pos.left}%`,
          top: `${pos.top}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <GiCastle className="text-white w-6 h-6" />
      </div>
    ));
  };

  const renderPlayerBase = (
    player: (typeof players)[0],
    base: (typeof players)[0]["bases"][0]
  ) => {
    const isHomeBase = base.chainId === player.homeChainId;
    const isLoggedInPlayer =
      player.address.toLowerCase() === address.toLowerCase();

    const iconColor = isLoggedInPlayer ? "text-yellow-500" : "text-white";
    const iconSize = isLoggedInPlayer ? "w-7 h-7" : "w-4 h-4";
    const iconBg = isHomeBase
      ? isLoggedInPlayer
        ? "bg-purple-600"
        : "bg-red-500"
      : isLoggedInPlayer
      ? "bg-indigo-600"
      : "bg-blue-500";

    const iconStyle = isLoggedInPlayer
      ? "border-4 border-yellow-300 shadow-lg"
      : "shadow-md";

    const tooltipId = `${player.name}-${base.chainId}-${
      isHomeBase ? "home" : "portal"
    }`;

    return (
      <Tooltip key={tooltipId} open={openTooltip === tooltipId}>
        <TooltipTrigger asChild>
          <div
            className={`${iconBg} ${iconStyle} rounded-full p-2 cursor-pointer absolute`}
            style={{
              left: `${base.x}%`,
              top: `${base.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => toggleTooltip(tooltipId)}
          >
            {isHomeBase ? (
              <GiCastle className={`${iconColor} ${iconSize}`} />
            ) : (
              <GiTeleport className={`${iconColor} ${iconSize}`} />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className="bg-[#8B4513] text-[#F4A460] p-3 rounded-md shadow-lg z-50 border-2 border-[#D2B48C]"
        >
          <p className="font-bold  text-lg mb-2">
            {isLoggedInPlayer
              ? `Your ${isHomeBase ? "Stronghold" : "Portal"}`
              : `${player.name}'s ${isHomeBase ? "Stronghold" : "Portal"}`}
          </p>
          <p className="mb-1">Chain ID: {base.chainId}</p>
          <p className="mb-1">
            Coordinates: ({base.x}, {base.y})
          </p>
          <p className="mb-1">
            <GiBowman className="inline-block w-4 h-4 mr-1 text-[#F4A460]" />{" "}
            Archers: {player.troops.archers}
          </p>
          <p className="mb-1">
            <GiBroadsword className="inline-block w-4 h-4 mr-1 text-[#F4A460]" />{" "}
            Warriors: {player.troops.warriors}
          </p>
          <p className="mb-1">
            <FaShieldAlt className="inline-block w-4 h-4 mr-1 text-[#F4A460]" />{" "}
            Defense: {player.defense}
          </p>
          {isHomeBase && (
            <p className="mb-1">
              <FaCoins className="inline-block w-4 h-4 mr-1 text-[#F4A460]" />{" "}
              Treasury: {player.treasury}
            </p>
          )}
          {!isLoggedInPlayer && (
            <AttackButton
              targetAddress={player.address as `0x${string}`}
              targetChain={base.chainId}
              tokenIds={[]} // Add this line
              className="mt-3"
            />
          )}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <Card className="w-full h-[calc(100vh-4rem)] overflow-hidden border-transparent">
        <CardContent className="p-0 h-full relative">
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: "url('/grid.jpg')",
              transform: `scale(1)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            {/* Render dashed vertical and horizontal lines */}
            <div
              className="absolute w-[1px] h-full bg-black border-dashed border-r-[0.7px] border-accent-foreground"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
              }}
            ></div>
            <div
              className="absolute h-[1px] w-full bg-black border-dashed border-b-[0.7px] border-accent-foreground px-6"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
              }}
            ></div>

            {/* Render player bases */}
            {players.map((player) =>
              player.bases.map((base) => renderPlayerBase(player, base))
            )}

            {/* Render the user's marker */}
            {renderUserMarker()}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
