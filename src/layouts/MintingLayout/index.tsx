import { FC, ReactNode } from 'react';

import { MintedNFTs } from 'features/ShowMintedNFTs/containers/MintedNFTs';
import { AirdropPhase } from 'features/ClaimAirdrop/containers/AirdropPhase';
import { PresalePhase } from 'features/WhitelistMint/containers/PresalePhase';
import { SalePhase } from 'features/PublicMint/containers/SalePhase';
import { TokenPlaceholder } from 'features/ShowMintedNFTs/components/TokenPlaceholder';

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
              badge: <AirdropPhase />,
            },
            {
              id: 'presale',
              to: '/presale',
              text: 'Private Presale',
              badge: <PresalePhase />,
            },
            {
              id: 'sale',
              to: '/sale',
              text: 'Public Sale',
              badge: <SalePhase />,
            },
          ]}
        />

        <div className={styles['content']}>
          <div>{children}</div>
          <TokenPlaceholder />
        </div>
      </div>
    </div>
  );
};
