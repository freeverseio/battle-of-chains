// hooks/useNftTypes.ts
import { useQuery } from "@apollo/client";
import { NFT_TYPES } from "@/graphql/queries/NftTypes";

interface NftType {
  id: string;
  name: string;
}

export const useNftTypes = () => {
  const { loading, error, data } = useQuery(NFT_TYPES);

  const nftTypes: Record<string, string> = {};
  if (data) {
    data.allNftTypes.nodes.forEach((type: NftType) => {
      nftTypes[type.id] = type.name;
    });
  }

  return { loading, error, nftTypes };
};
