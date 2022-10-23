import { FC } from 'react';

import { Image } from 'shared/components/Image';

import styles from './TokenPlaceholder.module.scss';

export const TokenPlaceholder: FC = () => (
  <div className={styles['root']}>
    <Image src="images/nft-mock.gif" alt="Token placeholder" width={142} height={142} />
  </div>
);
