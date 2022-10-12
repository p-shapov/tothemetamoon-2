import { FC, Fragment, ReactNode } from 'react';

import styles from './DefinitionList.module.scss';

export type TermProps = {
  title: string;
  children: ReactNode;
};

export type DefinitionListProps = {
  items: Array<{
    id?: string | number;
    title: string;
    element: ReactNode;
  }>;
};

export const Term: FC<TermProps> = ({ title, children }) => (
  <dl className={styles['root']}>
    <dt className={styles['term']}>
      <span>{title}</span>
    </dt>
    <dd className={styles['definition']}>{children}</dd>
  </dl>
);

export const DefinitionList: FC<DefinitionListProps> = ({ items }) => (
  <dl className={styles['root']}>
    {items.map(({ id, title, element }, idx) => (
      <Fragment key={id ?? idx}>
        <dt className={styles['term']}>{title}</dt>
        <dd className={styles['definition']}>{element}</dd>
      </Fragment>
    ))}
  </dl>
);
