import { observer } from 'mobx-react-lite';

import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { usePublicMint } from 'features/PublicMint/hooks/usePublicMint';

import { Page } from 'shared/types/page';
import { ClientOnly } from 'shared/components/ClientOnly';
import { Switch } from 'shared/components/Switch';

import styles from './Sale.module.scss';
import { Soon } from './Soon';
import { Available } from './Available';
import { Finished } from './Finished';
import { Minted } from './Minted';

export const Sale: Page = observer(() => {
  const { isAvailable, isMinted, isFinished, isSoon } = usePublicMint();

  return (
    <div className={styles['root']}>
      <ClientOnly>
        <Switch
          value={true}
          cases={[
            { guard: isAvailable, el: <Available /> },
            { guard: isFinished, el: <Finished /> },
            { guard: isMinted, el: <Minted /> },
            { guard: isSoon, el: <Soon /> },
          ]}
        />
      </ClientOnly>
    </div>
  );
});

Sale.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="sale">{page}</MintingLayout>
  </BaseLayout>
);
