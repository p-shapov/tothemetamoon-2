import { FC, ReactNode } from 'react';

import { MintedNFTs } from 'features/ShowMintedNFTs/containers/MintedNFTs';
import { AirdropPhase } from 'features/ClaimAirdrop/containers/AirdropPhase';
import { PresalePhase } from 'features/WhitelistMint/containers/PresalePhase';
import { SalePhase } from 'features/PublicMint/containers/SalePhase';
import { RevealedNFTs } from 'features/ShowMintedNFTs/containers/RevealedNFTs';

import { Tabs } from 'shared/components/Tabs';
import { useSsr } from 'shared/hooks/useSsr';

import styles from './MintingLayout.module.scss';

export type MintingLayoutProps = {
  id: 'airdrop' | 'presale' | 'sale';
  children: ReactNode;
};

export const MintingLayout: FC<MintingLayoutProps> = ({ id, children }) => {
  const isSsr = useSsr();

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
          {!isSsr && (
            <>
              {children}
              <RevealedNFTs />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
