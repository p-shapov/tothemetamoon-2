import { FC } from 'react';

import { TextSection } from 'shared/components/TextSection';

import styles from '../Presale.module.scss';

export const Minted: FC = () => {
  return (
    <div className={styles['info']}>
      <TextSection title="You minted all allowed NFT!">See ya on public sale!</TextSection>
    </div>
  );
};
