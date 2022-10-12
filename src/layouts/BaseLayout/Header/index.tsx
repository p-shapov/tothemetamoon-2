import { FC } from 'react';
import NextLink from 'next/link';

import { Link } from 'shared/components/Link';
import { Path } from 'shared/types/path';
import { ico_metalamp } from 'shared/icons/metalamp';
import { Button } from 'shared/components/Button';

import { headerNav } from '../data';
import styles from './Header.module.scss';

export const Header: FC = () => {
  return (
    <header className={styles['root']}>
      <div className={styles['layout']}>
        <NextLink href={Path.HOME} passHref>
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
          <Button>Connect</Button>
        </div>
      </div>
    </header>
  );
};
