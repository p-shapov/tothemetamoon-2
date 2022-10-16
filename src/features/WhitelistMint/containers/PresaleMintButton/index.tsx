import { FC } from 'react';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { Button } from 'shared/components/Button';

export const PresaleMintButton: FC = () => {
  const { mint, amountToMint } = useWhitelistMint();

  return (
    <Button uppercase onClick={mint}>
      {`Mint ${amountToMint} NFT`}
    </Button>
  );
};
