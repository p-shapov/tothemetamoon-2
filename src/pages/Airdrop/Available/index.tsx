import { FC } from 'react';

import { ClaimAirdropButton } from 'features/ClaimAirdrop/containers/ClaimAirdropButton';

import { TextSection } from 'shared/components/TextSection';

export const Available: FC = () => {
  return (
    <>
      <TextSection title="Congratulations!">
        Your wallet has been whitelisted! Claim your NFT now!
      </TextSection>

      <ClaimAirdropButton />
    </>
  );
};
