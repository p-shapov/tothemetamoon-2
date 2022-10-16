import { observer } from 'mobx-react-lite';

import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';
import { PresaleNFTsCounter } from 'features/WhitelistMint/containers/PresaleNFTsCounter';
import { PresaleMintButton } from 'features/WhitelistMint/containers/PresaleMintButton';

import { DefinitionList } from 'shared/components/DefinitionList';
import { Page } from 'shared/types/page';
import { useBalancePair } from 'shared/hooks/useBalancePair';
import { TextSection } from 'shared/components/TextSection';

import styles from './Presale.module.scss';

export const Presale: Page = observer(() => {
  const balancePair = useBalancePair();
  const { totalCost, price, isAvailable, isAllMinted, isFinished, isNotWhitelisted, isSoon, allowedToMint } =
    useWhitelistMint();

  return (
    <div className={styles['root']}>
      {isAvailable && (
        <>
          <div className={styles['info']}>
            <TextSection title="Be an early bird!">
              Choose the amount of tokens you want to buy and make a payment in any token.
            </TextSection>
          </div>
          <DefinitionList
            items={[
              { title: 'Your balance', element: balancePair?.format() },
              { title: 'Presale Price', element: price.value?.format() },
              { title: 'Amount of NFT', element: <PresaleNFTsCounter /> },
              { title: 'Total Cost', element: totalCost?.format() },
            ]}
          />
          <PresaleMintButton />
        </>
      )}
      {isNotWhitelisted && (
        <div className={styles['info']}>
          <TextSection title="You’re not whitelisted yet :(">
            To participate in Presale please send us an information about your project
          </TextSection>
        </div>
      )}
      {isFinished && (
        <div className={styles['info']}>
          <TextSection title="Private sale is over!">You can buy NFTs on public sale.</TextSection>
        </div>
      )}
      {isAllMinted && (
        <div className={styles['info']}>
          <TextSection title="You minted all allowed NFT!">See ya on public sale!</TextSection>
        </div>
      )}
      {isSoon && (
        <div className={styles['info']}>
          <TextSection title="Private sale starts soon">
            {`You can buy ut to ${
              allowedToMint.value
            } NFTs for the lowest price of ${price.value?.formatToEth()} per NFT`}
          </TextSection>
        </div>
      )}
    </div>
  );
});

Presale.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="presale">{page}</MintingLayout>
  </BaseLayout>
);
