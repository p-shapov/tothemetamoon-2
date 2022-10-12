import { FC, ReactElement } from 'react';

import styles from './IconButton.module.scss';

export type IconButtonProps = {
  label: string;
  children: ReactElement;
  onClick?(): void;
};

export const IconButton: FC<IconButtonProps> = ({ label, children, onClick = () => void 0 }) => {
  return (
    <button className={styles['root']} onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
};
