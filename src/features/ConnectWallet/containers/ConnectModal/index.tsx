import { FC } from 'react';

import { ConnectorId } from 'services/WagmiClient/types';

import { Modal } from 'shared/components/Modal';
import { TuplifyStringLiteralUnion } from 'shared/types/tuplifyStringLiteralUnion';

import { WalletButton } from '../WalletButton';
import styles from './ConnectModal.module.scss';

export const ConnectModal: FC = () => {
  const connectorsKeys: TuplifyStringLiteralUnion<ConnectorId> = ['metamask', 'coinbase', 'walletConnect'];

  return (
    <Modal title="Connect wallet">
      <div className={styles['root']}>
        <ul className={styles['list']}>
          {connectorsKeys.map((id) => (
            <li key={id}>
              <WalletButton id={id} />
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
