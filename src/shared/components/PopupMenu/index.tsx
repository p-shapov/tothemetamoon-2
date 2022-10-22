import cn from 'classnames';
import { FC, ReactNode, useState } from 'react';

import { Path } from 'services/Router/types';

import { Button } from '../Button';
import styles from './PopupMenu.module.scss';

export type PopupMenuProps = {
  children: ReactNode;
  isDisabled?: boolean;
  justify?: 'right' | 'left';
  items: Array<{
    text: string;
    to?: Path;
    onClick?(): void;
  }>;
};

export const PopupMenu: FC<PopupMenuProps> = ({ children, justify = 'right', isDisabled = false, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles['root']}
      onMouseEnter={setIsOpen.bind(null, !isDisabled && true)}
      onMouseLeave={setIsOpen.bind(null, false)}
    >
      {children}

      {!isDisabled && isOpen && (
        <div className={cn(styles['menu'], styles[`menu--justify_${justify}`])}>
          {items.map(({ text, to, onClick }, idx) => (
            <Button key={idx} to={to} onClick={onClick} uppercase stretch>
              {text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
