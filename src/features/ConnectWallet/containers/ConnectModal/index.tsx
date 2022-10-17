import { FC, ReactElement } from 'react';
import { useConnect } from 'wagmi';
import { observer } from 'mobx-react-lite';

import { useConnectWallet } from 'features/ConnectWallet/hooks/useConnectWallet';
import { Wallet } from 'features/ConnectWallet/components/Wallet';
import { ModalName } from 'features/ConnectWallet/store/types';
import { Wallets } from 'features/ConnectWallet/components/Wallets';

import { ConnectorId } from 'services/WagmiClient/types';
import { connectors } from 'services/WagmiClient/connectors';

import { ENVIRONMENT } from 'shared/constants/environment';

export const ConnectModal: FC = observer(() => {
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

    setTimeout(setConnectorId.bind(null, id));
    setModal(id);
    connect({ connector, chainId: Number(ENVIRONMENT.PREFERRED_CHAIN_ID) });
  };

  const { connect, isLoading, error } = useConnect({
    onSuccess: handleClose,
  });

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
