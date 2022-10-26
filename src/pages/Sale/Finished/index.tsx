import { FC } from 'react';

import { TextSection } from 'shared/components/TextSection';

import styles from '../Sale.module.scss';

export const Finished: FC = () => {
  return (
    <div className={styles['info']}>
      <TextSection title="Public sale is over!">See ya next time :)</TextSection>
    </div>
  );
};
