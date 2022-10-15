import { FC, ReactNode } from 'react';

import { MintedNFTs } from 'features/ShowMintedNFTs/containers/MintedNFTs';
import { AirdropStatus } from 'features/ClaimAirdrop/containers/AirdropStatus';
import { PresaleStatus } from 'features/WhitelistMint/containers/PresaleStatus';
import { SaleStatus } from 'features/PublicMint/containers/SaleStatus';

import { Tabs } from 'shared/components/Tabs';

import styles from './MintingLayout.module.scss';

export type MintingLayoutProps = {
  id: 'airdrop' | 'presale' | 'sale';
  children: ReactNode;
};

export const MintingLayout: FC<MintingLayoutProps> = ({ id, children }) => {
  return (
    <div className={styles['root']}>
      <div className={styles['minted-nfts']}>
        <MintedNFTs />
      </div>

      <div className={styles['layout']}>
        <Tabs
          active={id}
          items={[
            {
              id: 'airdrop',
              to: '/airdrop',
              text: 'Airdrop',
              badge: <AirdropStatus />,
            },
            {
              id: 'presale',
              to: '/presale',
              text: 'Private Presale',
              badge: <PresaleStatus />,
            },
            {
              id: 'sale',
              to: '/sale',
              text: 'Public Sale',
              badge: <SaleStatus />,
            },
          ]}
        />

        <div className={styles['content']}>{children}</div>
      </div>
    </div>
  );
};
