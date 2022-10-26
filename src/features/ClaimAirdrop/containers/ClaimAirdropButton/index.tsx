import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { Button } from 'shared/components/Button';

export const ClaimAirdropButton: FC = observer(() => {
  const { mint, isPending } = useClaimAirdrop();

  return (
    <Button uppercase onClick={mint} isDisabled={isPending} isLoading={isPending}>
      {isPending ? 'Pending...' : 'Claim NFT'}
    </Button>
  );
});
