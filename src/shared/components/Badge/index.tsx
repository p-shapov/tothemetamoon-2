import cn from 'classnames';
import { FC } from 'react';

import styles from './Badge.module.scss';

export type BadgeProps = {
  children: string;
  color?: 'violet' | 'green';
};

export const Badge: FC<BadgeProps> = ({ children, color = 'green' }) => (
  <span className={cn(styles['root'], styles[`root--color_${color}`])}>{children}</span>
);
