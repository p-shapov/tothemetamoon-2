import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useShowMintedNFTs } from 'features/ShowMintedNFTs/hooks/useShowMintedNFTs';

import { Progress } from 'shared/components/Progress';

export const MintedNFTs: FC = observer(() => {
  const { totalSupply, maxSupply } = useShowMintedNFTs();

  return (
    <>
      {totalSupply.value !== null && maxSupply.value !== null && (
        <Progress max={maxSupply.value} format={(value, max) => `${value}/${max} NFT are already minted`}>
          {totalSupply.value}
        </Progress>
      )}
    </>
  );
});
