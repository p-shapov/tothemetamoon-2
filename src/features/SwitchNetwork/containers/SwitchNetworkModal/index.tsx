import { FC } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import { Modal } from 'shared/components/Modal';
import { ENV } from 'shared/constants/env';
import { Button } from 'shared/components/Button';
import { ClientOnly } from 'shared/components/ClientOnly';

import styles from './SwitchNetworkModal.module.scss';

export const SwitchNetworkModal: FC = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <ClientOnly>
      {chain?.id !== ENV.PREFERRED_CHAIN_ID && isConnected && (
        <Modal title="Switch the network">
          <div className={styles['root']}>
            <span className={styles['text']}>
              {`It seems like your network is not ${ENV.PREFERRED_CHAIN_NAME}. 
              Please switch the network using your wallet or allow our system to do it.`}
            </span>

            <div className={styles['button']}>
              <Button onClick={switchNetwork?.bind(null, ENV.PREFERRED_CHAIN_ID)} uppercase stretch>
                {`Switch to ${ENV.PREFERRED_CHAIN_NAME}`}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ClientOnly>
  );
};
