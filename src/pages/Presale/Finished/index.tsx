import { FC } from 'react';

import { TextSection } from 'shared/components/TextSection';

import styles from '../Presale.module.scss';

export const Finished: FC = () => {
  return (
    <div className={styles['info']}>
      <TextSection title="Private sale is over!">You can buy NFTs on public sale.</TextSection>
    </div>
  );
};
