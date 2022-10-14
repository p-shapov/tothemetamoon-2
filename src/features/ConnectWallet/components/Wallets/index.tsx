import { FC } from 'react';

import { ConnectorId } from 'services/WagmiClient/types';

import { Button } from 'shared/components/Button';
import { Modal, ModalProps } from 'shared/components/Modal';
import { TuplifyStringLiteralUnion } from 'shared/types/tuplifyStringLiteralUnion';

import { connectButtonsData } from './data';
import styles from './Wallets.module.scss';

export type WalletsProps = {
  onConnect(id: ConnectorId): void;
} & Omit<ModalProps, 'title' | 'children'>;

export const Wallets: FC<WalletsProps> = ({ onConnect, ...modalProps }) => {
  const connectorIds: TuplifyStringLiteralUnion<ConnectorId> = ['metamask', 'coinbase', 'walletConnect'];

  return (
    <Modal title="Connect wallet" {...modalProps}>
      <div className={styles['root']}>
        <ul className={styles['list']}>
          {connectorIds.map((id) => {
            const { icon, text } = connectButtonsData[id];

            return (
              <li key={id} className={styles['item']}>
                <Button icon={icon} onClick={onConnect.bind(null, id)} size="lg" stretch>
                  {text}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
};
