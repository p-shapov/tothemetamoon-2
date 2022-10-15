import { useShowMintedNFTs } from './useShowMintedNFTs';

export const useTotalSupply = () => {
  const showMintedNFTs = useShowMintedNFTs();

  return showMintedNFTs.totalSupply;
};
