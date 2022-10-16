import { observer } from 'mobx-react-lite';

import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';
import { SaleMintButton } from 'features/PublicMint/containers/SaleMintButton';
import { SaleNFTsCounter } from 'features/PublicMint/containers/SaleNFTsCounter';

import { DefinitionList } from 'shared/components/DefinitionList';
import { Page } from 'shared/types/page';
import { useBalancePair } from 'shared/hooks/useBalancePair';
import { TextSection } from 'shared/components/TextSection';

import styles from './Sale.module.scss';

export const Sale: Page = observer(() => {
  const balancePair = useBalancePair();
  const { totalCost, price, isAvailable, isAllMinted, isFinished, isSoon } = usePublicMint();

  return (
    <div className={styles['root']}>
      {isAvailable && (
        <>
          <div className={styles['info']}>
            <TextSection title="Mint NFTs now!">
              You can mint an unlimited amount of NFTs for the market price
            </TextSection>
          </div>
          <DefinitionList
            items={[
              { title: 'Your balance', element: balancePair?.format() },
              { title: 'Presale Price', element: price.value?.format() },
              { title: 'Amount of NFT', element: <SaleNFTsCounter /> },
              { title: 'Total Cost', element: totalCost?.format() },
            ]}
          />
          <SaleMintButton />
        </>
      )}
      {isFinished && (
        <div className={styles['info']}>
          <TextSection title="Public sale is over!">See ya next time :)</TextSection>
        </div>
      )}
      {isAllMinted && (
        <div className={styles['info']}>
          <TextSection title="You minted all allowed NFT!">Thank you for your participation!</TextSection>
        </div>
      )}
      {isSoon && (
        <div className={styles['info']}>
          <TextSection title="Subscribe to our news!">
            We’ll send you a notification when public sale is available to participate
          </TextSection>
        </div>
      )}
    </div>
  );
});

Sale.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="sale">{page}</MintingLayout>
  </BaseLayout>
);
