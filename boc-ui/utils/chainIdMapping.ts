export const chainIdMapping: Record<string, number> = {
  Ethereum: 1,
  Polygon: 137,
  Arbitrum: 42161,
};

// utils/chainIdToAddress.ts

export const chainIdTouERC721Address: Record<number, string | undefined> = {
  1: process.env.NEXT_PUBLIC_ETHEREUM_UERC721_ADDRESS,
  137: process.env.NEXT_PUBLIC_POLYGON_UERC721_ADDRESS,
  42161: process.env.NEXT_PUBLIC_ARBITRUM_UERC721_ADDRESS,
};
