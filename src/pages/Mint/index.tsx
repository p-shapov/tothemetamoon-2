import { BaseLayout } from 'layouts/BaseLayout';

import { MintedNFTProgress } from 'features/ShowMintedNFTs/containers/MintedProgress';

import { Page } from 'shared/types/page';

import styles from './Mint.module.scss';

export const Mint: Page = () => (
  <div className={styles['root']}>
    <div className={styles['progress']}>
      <MintedNFTProgress />
    </div>
  </div>
);

Mint.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
