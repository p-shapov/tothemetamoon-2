import cn from 'classnames';
import { FC } from 'react';

import styles from './Orogress.module.scss';

export type ProgressProps = {
  value: number;
  total: number;
  format?(value: number, total: number): string;
};

export const Progress: FC<ProgressProps> = ({ value, total, format = (value) => value }) => {
  return (
    <div className={styles['root']}>
      <div
        className={cn(styles['fill'], value !== total && styles['fill--not-completed'])}
        style={{ maxWidth: `${Math.trunc((value / total) * 100)}%` }}
      />
      <span className={styles['value']}>{format(value, total)}</span>
    </div>
  );
};
