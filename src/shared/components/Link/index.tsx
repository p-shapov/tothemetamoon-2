import cn from 'classnames';
import { FC } from 'react';
import NextLink from 'next/link';

import { Path } from 'services/Router/types';

import styles from './Link.module.scss';

export type LinkProps = {
  to?: Path;
  href?: string;
  children: string;
  size?: 'lg' | 'sm';
  isActive?: boolean;
  onClick?(): void;
};

export const Link: FC<LinkProps> = ({
  to,
  href,
  children,
  size = 'sm',
  isActive = false,
  onClick = () => void 0,
}) => {
  const className = cn(styles['root'], styles[`root--size_${size}`], isActive && styles['root--active']);

  if (href)
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    );

  if (to)
    return (
      <NextLink href={to}>
        <a className={className} onClick={onClick}>
          {children}
        </a>
      </NextLink>
    );

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
};
