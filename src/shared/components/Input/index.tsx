import cn from 'classnames';
import { FC } from 'react';

import styles from './Input.module.scss';

export type InputProps = {
  type?: 'text' | 'email' | 'tel';
  label: string;
  children: string;
  isRequired?: boolean;
  isValid?: boolean;
  onChange(value: string): void;
};

export const Input: FC<InputProps> = ({ type = 'text', children, onChange, isRequired, label }) => (
  <label className={cn(styles['root'])}>
    <input
      className={styles['input']}
      type={type}
      value={children}
      required={isRequired}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
    {!children && <span className={styles['label']}>{label}</span>}
  </label>
);
