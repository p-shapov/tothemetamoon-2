import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { SwapWidget, darkTheme } from '@uniswap/widgets';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';

import { useGetEth } from 'features/GetEth/hooks/useGetEth';

import { Modal } from 'shared/components/Modal';
import { ENV } from 'shared/constants/env';

import styles from './GetEthModal.module.scss';

export const GetEthModal: FC = observer(() => {
  const { data: signer } = useSigner();
  const { showModal, toggleModal } = useGetEth();

  return (
    <>
      {showModal && (
        <Modal
          title="Lack of ETH?"
          description="Swap your tokens and mint NFT using Uniswap"
          onClose={toggleModal}
        >
          <div className={styles['root']}>
            <SwapWidget
              provider={signer?.provider as ethers.providers.JsonRpcProvider}
              defaultChainId={ENV.PREFERRED_CHAIN_ID}
              theme={darkTheme}
              jsonRpcUrlMap={{
                [ENV.PREFERRED_CHAIN_ID]: `https://eth-goerli.alchemyapi.io/v2/${ENV.ALCHEMY_API_KEY}`,
              }}
              hideConnectionUI
            />
          </div>
        </Modal>
      )}
    </>
  );
});
