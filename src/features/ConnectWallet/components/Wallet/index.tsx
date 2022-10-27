import cn from 'classnames';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ConnectorId } from 'services/WagmiClient/types';

import { Qrcode } from 'shared/components/Qrcode';
import { ico_loader } from 'shared/icons/loader';
import { Modal } from 'shared/components/Modal';
import { ErrorWithCode } from 'shared/types/errorWithCode';

import { walletModalMap } from './data';
import styles from './Wallet.module.scss';
import { Tip } from '../Tip';

export type WalletProps = {
  id: ConnectorId;
  qrcode: string | null;
  error: ErrorWithCode | null;
  isLoading: boolean;
  onClose(): void;
  onBack(): void;
};

export const Wallet: FC<WalletProps> = observer(({ id, qrcode, error, isLoading, onBack, onClose }) => {
  const { title, icon, tipExtension, tipQrcode } = walletModalMap[id];

  const tip = qrcode ? tipQrcode : tipExtension;
  const isMetamaskNotAuthorized = id === 'metamask' && error?.code === -32002;

  return (
    <Modal title={title} onClose={onClose}>
      <div className={styles['root']}>
        <div className={cn(styles['image'], qrcode && styles['image--qrcode'])}>
          {qrcode && <Qrcode value={qrcode} logo={icon} />}
          {!qrcode && (isLoading || isMetamaskNotAuthorized) && (
            <div className={styles['loader']}>{ico_loader}</div>
          )}
          {!qrcode && icon}
        </div>

        <div className={styles['info']}>
          <span className={styles['status']}>{error ? 'Request failed' : 'Requesting Connection'}</span>
          <span className={styles['message']}>
            <Tip id={id} fallback={tip} error={error} />
          </span>

          <div className={styles['back']}>
            <button type="button" className={styles['back']} onClick={onBack}>
              Go back
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
});
