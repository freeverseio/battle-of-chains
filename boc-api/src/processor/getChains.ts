import { Chain } from "./types";

export async function getChains(): Promise<Chain[]> {
  return new Promise((resolve) => {
    const events: Chain[] = [
      {
        chain_id: 137,
        name: "Polygon PoS Mock",
        score: 242,
      },
      {
        chain_id: 1,
        name: "Ethereum",
        score: 100,
      },
      {
        chain_id: 42161,
        name: "Arbitrum",
        score: 100,
      },
    ];
    setTimeout(() => resolve(events), 1000); // Simulate a delay
  });
}