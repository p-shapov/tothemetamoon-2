import { FC, ReactElement } from 'react';
import cn from 'classnames';
import NextLink from 'next/link';

import styles from './Button.module.scss';

export type ButtonProps = {
  to?: string;
  children: string;
  type?: 'button' | 'submit';
  size?: 'sm' | 'lg';
  icon?: ReactElement;
  uppercase?: boolean;
  stretch?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?(): void;
};

export const Button: FC<ButtonProps> = ({
  to,
  children,
  type = 'button',
  size = 'sm',
  uppercase = false,
  stretch = false,
  isDisabled = false,
  isLoading = false,
  onClick = () => void 0,
  icon,
}) => {
  const className = cn(styles['root'], styles[`root--size_${size}`], {
    [styles['root--uppercase']]: uppercase,
    [styles['root--stretch']]: stretch,
    [styles['root--loading']]: isLoading,
  });

  const inner = (
    <>
      <span className={styles['text']}>{children}</span>
      {icon && <span className={styles['icon']}>{icon}</span>}
    </>
  );

  return to ? (
    <NextLink href={to} passHref>
      <a className={className}>{inner}</a>
    </NextLink>
  ) : (
    <button className={className} type={type} onClick={onClick} disabled={isDisabled}>
      {inner}
    </button>
  );
};
