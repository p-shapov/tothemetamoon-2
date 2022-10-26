import { observer } from 'mobx-react-lite';

import { BaseLayout } from 'layouts/BaseLayout';
import { MintingLayout } from 'layouts/MintingLayout';

import { useClaimAirdrop } from 'features/ClaimAirdrop/hooks/useClaimAirdrop';

import { Page } from 'shared/types/page';
import { ClientOnly } from 'shared/components/ClientOnly';

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
        {isAvailable && <Available />}
        {isNotWhitelisted && <NotWhitelisted />}
        {isSoon && <Soon />}
        {isFinished && <Finished />}
        {isMinted && <Minted />}
      </ClientOnly>
    </div>
  );
});

Airdrop.getLayout = (page) => (
  <BaseLayout>
    <MintingLayout id="airdrop">{page}</MintingLayout>
  </BaseLayout>
);
