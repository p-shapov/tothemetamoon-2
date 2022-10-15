import { useShowMintedNFTs } from './useShowMintedNFTs';

export const useMaxSupply = () => {
  const showMintedNFTs = useShowMintedNFTs();

  return showMintedNFTs.maxSupply;
};
