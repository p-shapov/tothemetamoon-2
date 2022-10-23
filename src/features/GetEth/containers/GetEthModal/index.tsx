import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { SwapWidget, darkTheme } from '@uniswap/widgets';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { goerli } from 'wagmi/chains';

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
                [goerli.id]: `https://eth-goerli.alchemyapi.io/v2/${ENV.ALCHEMY_API_KEY}`,
              }}
              tokenList={[
                {
                  address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
                  symbol: 'WETH',
                  name: 'Wrapped Ether',
                  chainId: goerli.id,
                  decimals: 18,
                  logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6/logo.png', // eslint-disable-line
                },
              ]}
              hideConnectionUI
            />
          </div>
        </Modal>
      )}
    </>
  );
});
