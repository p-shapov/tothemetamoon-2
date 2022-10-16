import { FC } from 'react';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { Button } from 'shared/components/Button';

export const SaleMintButton: FC = () => {
  const { mint, amountToMint } = usePublicMint();

  return (
    <Button uppercase onClick={mint}>
      {`Mint ${amountToMint} NFT`}
    </Button>
  );
};
