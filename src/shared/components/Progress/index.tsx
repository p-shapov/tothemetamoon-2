import cn from 'classnames';
import { FC } from 'react';

import styles from './Progress.module.scss';

export type ProgressProps = {
  children: number;
  max: number;
  format?(value: number, max: number): string;
};

export const Progress: FC<ProgressProps> = ({ children: value, max, format = (value) => value }) => {
  return (
    <div className={styles['root']}>
      <div
        className={cn(styles['fill'], value !== max && styles['fill--not-completed'])}
        style={{ maxWidth: `${Math.trunc((value / max) * 100)}%` }}
      />
      <span className={styles['value']}>{format(value, max)}</span>
    </div>
  );
};
