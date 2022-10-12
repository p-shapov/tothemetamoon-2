import { FC, ReactNode } from 'react';

import styles from './Term.module.scss';

export type TermProps = {
  title: string;
  children: ReactNode;
};

export const Term: FC<TermProps> = ({ title, children }) => (
  <dl className={styles['root']}>
    <dt className={styles['title']}>{title}</dt>
    <dd className={styles['definition']}>{children}</dd>
  </dl>
);
