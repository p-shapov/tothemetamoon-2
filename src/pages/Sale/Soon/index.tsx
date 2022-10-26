import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';
import { SubscribeButton } from 'features/Subscribe/containers/SubscribeButton';

import { Term } from 'shared/components/DefinitionList';
import { TextSection } from 'shared/components/TextSection';

import styles from '../Sale.module.scss';

export const Soon: FC = observer(() => {
  const { price } = usePublicMint();

  return (
    <>
      <div className={styles['info']}>
        <TextSection title="Subscribe to our news!">
          We’ll send you a notification when public sale is available to participate
        </TextSection>
      </div>

      <Term title="Public Price">{price.value?.format()}</Term>

      <SubscribeButton />
    </>
  );
});
