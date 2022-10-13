import { FC } from 'react';

import { connectors } from 'services/WagmiClient/connectors';
import { ConnectorId } from 'services/WagmiClient/types';

import { Button } from 'shared/components/Button';

import { useConnectWallet } from '../../hooks/useConnectWallet';
import { connectButtonsMap } from './data';

export type WalletButtonProps = {
  id: ConnectorId;
};

export const WalletButton: FC<WalletButtonProps> = ({ id }) => {
  const {
    store: { setModal },
    wagmi: { connect },
  } = useConnectWallet();

  const { text, icon } = connectButtonsMap[id];
  const connector = connectors[id];

  const handleConnect = () => {
    connect(connector);
    setModal(id);
  };

  return (
    <Button icon={icon} size="lg" onClick={handleConnect} stretch>
      {text}
    </Button>
  );
};
