import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { GetEthButton } from 'features/GetEth/containers/GetEthButton';
import { SaleMintButton } from 'features/PublicMint/containers/SaleMintButton';
import { SaleNFTsCounter } from 'features/PublicMint/containers/SaleNFTsCounter';
import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { DefinitionList } from 'shared/components/DefinitionList';
import { TextSection } from 'shared/components/TextSection';
import { useBalancePair } from 'shared/hooks/useBalancePair';

import styles from '../Sale.module.scss';

export const Available: FC = observer(() => {
  const { price, totalCost } = usePublicMint();
  const balancePair = useBalancePair();

  const isInsufficientBalance = !!balancePair && !!totalCost && totalCost.gt(balancePair);

  return (
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

      {price.isFetched && (
        <>
          {isInsufficientBalance ? <GetEthButton /> : <SaleMintButton />}

          {isInsufficientBalance && <span>You have not enough ETH for mint.</span>}
        </>
      )}
    </>
  );
});
