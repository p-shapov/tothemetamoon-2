import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { TextSection } from 'shared/components/TextSection';

export const Soon: FC = observer(() => {
  const { maxSupply } = useClaimAirdrop();

  return (
    <TextSection title="Airdrop starts soon!">{`You can claim ${maxSupply.value} NFTs for free!`}</TextSection>
  );
});
