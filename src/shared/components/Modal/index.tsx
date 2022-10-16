import { FC, ReactNode } from 'react';

import { IconButton } from 'shared/components/IconButton';
import { ico_crossCircled } from 'shared/icons/crossCircled';

import styles from './Modal.module.scss';

export type ModalProps = {
  title: string;
  description?: string;
  children: ReactNode;
  onClose?(): void;
};

export const Modal: FC<ModalProps> = ({ children, title, description, onClose = () => void 0 }) => {
  return (
    <div className={styles['root']}>
      <div className={styles['content']}>
        <div className={styles['info']}>
          <div className={styles['header']}>
            <span className={styles['title']}>{title}</span>

            <IconButton label="Close modal" onClick={onClose}>
              {ico_crossCircled}
            </IconButton>
          </div>

          {description && <span className={styles['description']}>{description}</span>}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
