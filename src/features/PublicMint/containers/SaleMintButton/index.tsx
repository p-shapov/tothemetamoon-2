import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { Button } from 'shared/components/Button';
import { ClientOnly } from 'shared/components/ClientOnly';

export const SaleMintButton: FC = observer(() => {
  const { mint, amount, isPending } = usePublicMint();

  return (
    <ClientOnly>
      <Button uppercase onClick={mint} isDisabled={isPending} isLoading={isPending}>
        {isPending ? 'Pending...' : `Mint ${amount} NFT`}
      </Button>
    </ClientOnly>
  );
});
