import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { Button } from 'shared/components/Button';

export const PresaleMintButton: FC = observer(() => {
  const { mint, amount, isPending } = useWhitelistMint();

  return (
    <Button uppercase onClick={mint} isDisabled={isPending} isLoading={isPending}>
      {isPending ? 'Pending...' : `Mint ${amount} NFT`}
    </Button>
  );
});
