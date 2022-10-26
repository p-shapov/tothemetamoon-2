import { FC } from 'react';

import { GetWhitelistedButton } from 'features/GetWhitelisted/containers/GetWhitelistedButton';

import { TextSection } from 'shared/components/TextSection';

import styles from '../Presale.module.scss';

export const NotWhitelisted: FC = () => {
  return (
    <>
      <div className={styles['info']}>
        <TextSection title="You’re not whitelisted yet :(">
          To participate in Presale please send us an information about your project
        </TextSection>
      </div>

      <GetWhitelistedButton type="presale" />
    </>
  );
};
