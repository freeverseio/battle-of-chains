import { ChainType } from "./types";

export async function getChains(): Promise<ChainType[]> {
  return new Promise((resolve) => {
    const events: ChainType[] = [
      {
        chain_id: 137,
        name: "Polygon",
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