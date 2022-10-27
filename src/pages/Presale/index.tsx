import { observer } from 'mobx-react-lite';

import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { useWhitelistMint } from 'features/WhitelistMint/hooks/useWhitelistMint';

import { Page } from 'shared/types/page';
import { ClientOnly } from 'shared/components/ClientOnly';
import { Switch } from 'shared/components/Switch';

import styles from './Presale.module.scss';
import { Available } from './Available';
import { NotWhitelisted } from './NotWhitelisted';
import { Finished } from './Finished';
import { Minted } from './Minted';
import { Soon } from './Soon';

export const Presale: Page = observer(() => {
  const { isAvailable, isMinted, isFinished, isNotWhitelisted, isSoon } = useWhitelistMint();

  return (
    <div className={styles['root']}>
      <ClientOnly>
        <Switch
          value={true}
          cases={[
            { guard: isAvailable, el: <Available /> },
            { guard: isNotWhitelisted, el: <NotWhitelisted /> },
            { guard: isFinished, el: <Finished /> },
            { guard: isMinted, el: <Minted /> },
            { guard: isSoon, el: <Soon /> },
          ]}
        />
      </ClientOnly>
    </div>
  );
});

Presale.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="presale">{page}</MintingLayout>
  </BaseLayout>
);
