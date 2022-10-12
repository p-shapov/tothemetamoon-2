import { FC, ReactNode } from 'react';

import { IconButton } from 'shared/components/IconButton';
import { ico_crossCircled } from 'shared/icons/crossCircled';

import styles from './Modal.module.scss';

export type ModalProps = {
  children: ReactNode;
  onClose?(): void;
};

export const Modal: FC<ModalProps> = ({ children, onClose = () => void 0 }) => {
  return (
    <div className={styles['root']}>
      <div className={styles['content']}>
        <div>{children}</div>

        <div className={styles['close']}>
          <IconButton label="Close modal" onClick={onClose}>
            {ico_crossCircled}
          </IconButton>
        </div>
      </div>
    </div>
  );
};
