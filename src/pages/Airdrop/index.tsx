import { observer } from 'mobx-react-lite';

import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { ClaimAirdropButton } from 'features/ClaimAirdrop/containers/ClaimAirdropButton';
import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';
import { GetWhitelistedButton } from 'features/GetWhitelisted/containers/GetWhitelistedButton';

import { TextSection } from 'shared/components/TextSection';
import { Page } from 'shared/types/page';

import styles from './Airdrop.module.scss';

export const Airdrop: Page = observer(() => {
  const { isAvailable, isClaimed, isFinished, isSoon, isNotWhitelisted, allowedToClaim, isFetched } =
    useClaimAirdrop();

  return (
    <div className={styles['root']}>
      {isFetched && (
        <>
          {isAvailable && (
            <>
              <TextSection title="Congratulations!">
                Your wallet has been whitelisted! Claim your NFT now!
              </TextSection>

              <ClaimAirdropButton />
            </>
          )}

          {isNotWhitelisted && (
            <>
              <TextSection title="You’re not whitelisted yet :(">
                To participate in AirDrop please send us an information about your project
              </TextSection>

              <GetWhitelistedButton type="airdrop" />
            </>
          )}

          {isSoon && (
            <TextSection title="Airdrop starts soon!">{`You can claim ${allowedToClaim.value} NFTs for free!`}</TextSection>
          )}

          {isFinished && <TextSection title="Airdrop is over!" />}

          {isClaimed && <TextSection title="You claimed your NFTs!" />}
        </>
      )}
    </div>
  );
});

Airdrop.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="airdrop">{page}</MintingLayout>
  </BaseLayout>
);
