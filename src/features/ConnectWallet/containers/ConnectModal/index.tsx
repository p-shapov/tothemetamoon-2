import { FC, ReactElement, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { observer } from 'mobx-react-lite';

import { useConnectWallet } from 'features/ConnectWallet/hooks/useConnectWallet';
import { Wallet } from 'features/ConnectWallet/components/Wallet';
import { ModalName } from 'features/ConnectWallet/store/types';
import { Wallets } from 'features/ConnectWallet/components/Wallets';

import { ConnectorId } from 'services/WagmiClient/types';
import { connectors } from 'services/WagmiClient/connectors';

import { ENV } from 'shared/constants/env';

export const ConnectModal: FC = observer(() => {
  const { isConnected } = useAccount();

  const {
    modal,
    setModal,
    setConnectorId,
    qrcode: { value: qrcode },
  } = useConnectWallet();

  const handleBack = () => {
    setConnectorId(null);
    setModal('wallets');
  };

  const handleClose = setModal.bind(null, null);

  const handleConnect = (id: ConnectorId) => {
    const connector = connectors[id];

    setModal(id);
    connect({ connector, chainId: ENV.PREFERRED_CHAIN_ID });
    // setTimeout for queuing qrcode fetch after provider initialization
    setTimeout(() => setConnectorId(id));
  };

  const { connect, isLoading, error } = useConnect({
    onSuccess: handleClose,
  });

  useEffect(() => {
    if (isConnected) handleClose();
  }, [handleClose, isConnected, setModal]);

  const getWallet = (id: ConnectorId) => (
    <Wallet
      id={id}
      onBack={handleBack}
      onClose={handleClose}
      isLoading={isLoading}
      qrcode={qrcode}
      error={error}
    />
  );

  const modals: Record<ModalName, ReactElement> = {
    wallets: <Wallets onConnect={handleConnect} onClose={handleClose} />,
    metamask: getWallet('metamask'),
    coinbase: getWallet('coinbase'),
    walletConnect: getWallet('walletConnect'),
  };

  return modal && modals[modal];
});
