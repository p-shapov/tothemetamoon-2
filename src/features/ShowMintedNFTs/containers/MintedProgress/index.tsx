import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useMaxSupply } from 'features/ShowMintedNFTs/hooks/useMaxSupply';
import { useTotalSupply } from 'features/ShowMintedNFTs/hooks/useTotalSupply';

import { Progress } from 'shared/components/Progress';

export const MintedNFTProgress: FC = observer(() => {
  const totalSupply = useTotalSupply();
  const maxSupply = useMaxSupply();

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
