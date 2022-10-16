import { FC } from 'react';

import styles from './TextSection.module.scss';

export type TextSectionProps = {
  title: string;
  children?: string;
};

export const TextSection: FC<TextSectionProps> = ({ title, children }) => (
  <section className={styles['root']}>
    <div className={styles['title']}>
      <h2>{title}</h2>
    </div>
    {children && <p className={styles['paragraph']}>{children}</p>}
  </section>
);
