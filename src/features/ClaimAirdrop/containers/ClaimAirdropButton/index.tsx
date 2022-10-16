import { FC } from 'react';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { Button } from 'shared/components/Button';

export const ClaimAirdropButton: FC = () => {
  const { claim, isAvailable } = useClaimAirdrop();

  return (
    <Button uppercase onClick={claim} isDisabled={!isAvailable}>
      Claim NFT
    </Button>
  );
};
