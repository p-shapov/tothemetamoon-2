import cn from 'classnames';
import { FC } from 'react';

import { ConnectorId } from 'services/WagmiClient/types';

import { Qrcode } from 'shared/components/Qrcode';
import { ico_loader } from 'shared/icons/loader';

import { useConnectWallet } from '../../hooks/useConnectWallet';
import { walletModalMap } from './data';
import styles from './WalletModal.module.scss';
import { useQrcode } from './hooks';
import { ModalWithClose } from '../ModalWithClose';

export type WalletModalProps = {
  id: ConnectorId;
};

export const WalletModal: FC<WalletModalProps> = ({ id }) => {
  const qrcode = useQrcode(id);
  const {
    store: { setModal },
    wagmi: { error, isLoading },
  } = useConnectWallet();

  const { title, icon, tipExtension, tipQrcode } = walletModalMap[id];

  const tip = qrcode ? tipQrcode : tipExtension;

  return (
    <ModalWithClose title={title}>
      <div className={styles['root']}>
        <div className={cn(styles['image'], qrcode && styles['image--qrcode'])}>
          {qrcode && <Qrcode value={qrcode} logo={icon} />}
          {!qrcode && isLoading && <div className={styles['loader']}>{ico_loader}</div>}
          {!qrcode && icon}
        </div>

        <div className={styles['info']}>
          <span className={styles['status']}>{error ? 'Request failed' : 'Requesting Connection'}</span>
          <span className={styles['message']}>{error ? error.message : tip}</span>

          <button type="button" className={styles['back']} onClick={setModal.bind(null, 'connect')}>
            Go back
          </button>
        </div>
      </div>
    </ModalWithClose>
  );
};
