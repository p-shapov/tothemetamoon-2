import { useEffect, useState } from 'react';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { connectors } from 'services/WagmiClient/connectors';
import { ConnectorId } from 'services/WagmiClient/types';

export const useQrcode = (id: ConnectorId) => {
  const [qrcode, setQrcode] = useState<string | null>(null);

  const connector = connectors[id];

  useEffect(() => {
    let canceled = false;

    const setQrCodeAsync = async () => {
      let qrcode: string | null = null;

      if (connector instanceof CoinbaseWalletConnector) {
        const provider = await connector.getProvider();

        qrcode = provider.qrUrl ?? null;
      }

      if (connector instanceof WalletConnectConnector) {
        const provider = await connector.getProvider();

        qrcode = provider.connector.uri ?? null;
      }

      if (!canceled) setQrcode(qrcode);
    };

    setTimeout(setQrCodeAsync);

    return () => {
      canceled = true;
    };
  }, [connector]);

  return qrcode;
};
