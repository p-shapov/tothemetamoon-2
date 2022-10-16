import cn from 'classnames';
import { FC } from 'react';

import styles from './Input.module.scss';

export type InputProps = {
  type?: 'text' | 'email' | 'tel' | 'text-area';
  label: string;
  children: string;
  isRequired?: boolean;
  onChange(value: string): void;
};

export const Input: FC<InputProps> = ({ type = 'text', children, onChange, isRequired, label }) => (
  <label
    className={cn(styles['root'], {
      [styles['root--has-value']]: children.length > 0,
    })}
  >
    {type === 'text-area' ? (
      <textarea
        className={styles['input']}
        value={children}
        required={isRequired}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    ) : (
      <input
        className={styles['input']}
        type={type}
        value={children}
        required={isRequired}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    )}
    <span className={styles['label']}>{label}</span>
  </label>
);
