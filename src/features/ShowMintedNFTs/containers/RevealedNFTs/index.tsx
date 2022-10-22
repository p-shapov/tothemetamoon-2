import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { useShowMintedNFTs } from 'features/ShowMintedNFTs/hooks/useShowMintedNFTs';

import { Image } from 'shared/components/Image';

import styles from './RevealedNFTs.module.scss';

export const RevealedNFTs: FC = observer(() => {
  const { isRevealed } = useShowMintedNFTs();

  return (
    <div className={styles['root']}>
      {isRevealed ? (
        <Image src="images/nft-mock.gif" alt="Your NFTs!" width={182} height={182} />
      ) : (
        <div className={styles['mock']} />
      )}
    </div>
  );
});
