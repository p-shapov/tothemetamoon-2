import { FC } from 'react';

import { Image } from 'shared/components/Image';

import { socialLinks } from '../data';
import styles from './Footer.module.scss';

export const Footer: FC = () => {
  return (
    <footer className={styles['root']}>
      <ul className={styles['social-links']}>
        {socialLinks.map(({ alt, href, src }, idx) => (
          <li key={idx}>
            <a className={styles['social-media']} href={href} rel="noopener noreferrer" target="_blank">
              <Image alt={alt} src={src} width={40} height={40} withFadeIn />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
};
