import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { Term } from 'shared/components/DefinitionList';
import { TextSection } from 'shared/components/TextSection';

import styles from '../Presale.module.scss';

export const Soon: FC = observer(() => {
  const { price, maxSupply } = useWhitelistMint();

  return (
    <>
      <div className={styles['info']}>
        <TextSection title="Private sale starts soon">
          {`You can buy ut to ${
            maxSupply.value
          } NFTs for the lowest price of ${price.value?.formatToEth()} per NFT`}
        </TextSection>
      </div>

      <Term title="Presale Price">{price.value?.format()}</Term>
    </>
  );
});
