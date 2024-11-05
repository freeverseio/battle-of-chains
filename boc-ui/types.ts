// types/user.ts
export interface User {
  address: `0x${string}`;
  score: string;
  treasury: string;
  name: string;
  chainByHomechain: {
    chainId: number;
    name: string;
  };
  assetsByOwner: {
    totalCount: number;
    nodes: {
      chainByChainId: {
        name: string;
      };
      type: string;
    }[];
  };
}
