import { FC } from 'react';
import NextLink from 'next/link';

import { ConnectButton } from 'features/ConnectWallet/containers/ConnectButton';

import { Link } from 'shared/components/Link';
import { ico_metalamp } from 'shared/icons/metalamp';

import { headerNav } from '../data';
import styles from './Header.module.scss';

export const Header: FC = () => {
  return (
    <header className={styles['root']}>
      <div className={styles['layout']}>
        <NextLink href="/" passHref>
          <a className={styles['logo']}>{ico_metalamp}</a>
        </NextLink>

        <nav>
          <ul className={styles['nav']}>
            {headerNav.map(({ text, href }, idx) => (
              <li key={idx}>
                <Link href={href}>{text}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles['account']}>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
