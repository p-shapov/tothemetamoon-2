import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { GetEthButton } from 'features/GetEth/containers/GetEthButton';
import { PresaleMintButton } from 'features/WhitelistMint/containers/PresaleMintButton';
import { PresaleNFTsCounter } from 'features/WhitelistMint/containers/PresaleNFTsCounter';
import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { DefinitionList } from 'shared/components/DefinitionList';
import { TextSection } from 'shared/components/TextSection';
import { useBalancePair } from 'shared/hooks/useBalancePair';

import styles from '../Presale.module.scss';

export const Available: FC = observer(() => {
  const { totalCost, price } = useWhitelistMint();
  const balancePair = useBalancePair();

  const isInsufficientBalance = !!balancePair && !!totalCost && totalCost.gt(balancePair);

  return (
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

      {price.isFetched && (
        <>
          {isInsufficientBalance ? <GetEthButton /> : <PresaleMintButton />}

          {isInsufficientBalance && <span>You have not enough ETH for mint.</span>}
        </>
      )}
    </>
  );
});
