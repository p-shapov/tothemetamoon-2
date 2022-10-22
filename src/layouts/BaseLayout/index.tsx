import { FC, ReactNode } from 'react';
import cn from 'classnames';

import { SwitchNetworkModal } from 'features/SwitchNetwork/containers/SwitchNetworkModal';

import { Footer } from './Footer';
import { Header } from './Header';
import styles from './BaseLayout.module.scss';

export type BaseLayoutProps = {
  children: ReactNode;
  gradient?: 'diagonal' | 'linear';
};

export const BaseLayout: FC<BaseLayoutProps> = ({ children, gradient = 'linear' }) => {
  return (
    <>
      <div className={styles['root']}>
        <div className={styles['header']}>
          <Header />
        </div>
        <main className={styles['main']}>{children}</main>
        <div className={styles['footer']}>
          <Footer />
        </div>
        <div className={cn(styles['gradient'], styles[`gradient--type_${gradient}`])}>
          {gradient === 'diagonal' && <div className={styles['diagonal']} />}
        </div>
      </div>

      <SwitchNetworkModal />
    </>
  );
};
