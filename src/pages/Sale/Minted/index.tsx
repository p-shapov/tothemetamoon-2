import { FC } from 'react';

import { TextSection } from 'shared/components/TextSection';

import styles from '../Sale.module.scss';

export const Minted: FC = () => {
  return (
    <div className={styles['info']}>
      <TextSection title="You minted all allowed NFT!">Thank you for your participation!</TextSection>
    </div>
  );
};
