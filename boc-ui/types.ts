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
export interface UserScore {
  address: `0x${string}`;
  score: string;
  name: string;
  chainByHomechain: {
    chainId: number;
    name: string;
  };
}

export interface Chain {
  chainId: number;
  name: string;
  score: number;
  usersByHomechain: {
    nodes: User[];
  };
}
