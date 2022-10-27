import { observer } from 'mobx-react-lite';

import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { Page } from 'shared/types/page';
import { ClientOnly } from 'shared/components/ClientOnly';
import { Switch } from 'shared/components/Switch';

import styles from './Airdrop.module.scss';
import { Available } from './Available';
import { NotWhitelisted } from './NotWhitelisted';
import { Soon } from './Soon';
import { Finished } from './Finished';
import { Minted } from './Minted';

export const Airdrop: Page = observer(() => {
  const { isAvailable, isMinted, isFinished, isSoon, isNotWhitelisted } = useClaimAirdrop();

  return (
    <div className={styles['root']}>
      <ClientOnly>
        <Switch
          value={true}
          cases={[
            { guard: isAvailable, el: <Available /> },
            { guard: isNotWhitelisted, el: <NotWhitelisted /> },
            { guard: isSoon, el: <Soon /> },
            { guard: isFinished, el: <Finished /> },
            { guard: isMinted, el: <Minted /> },
          ]}
        />
      </ClientOnly>
    </div>
  );
});

Airdrop.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="airdrop">{page}</MintingLayout>
  </BaseLayout>
);
