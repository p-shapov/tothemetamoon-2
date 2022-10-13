import { ReactElement } from 'react';

import { ConnectorId } from 'services/WagmiClient/types';

import { ico_coinbase } from 'shared/icons/coinbase';
import { ico_metamask } from 'shared/icons/metamask';
import { ico_walletConnect } from 'shared/icons/wallet-connect';

export const walletModalMap: Record<
  ConnectorId,
  {
    title: string;
    icon: ReactElement;
    tipQrcode?: string;
    tipExtension?: string;
  }
> = {
  metamask: {
    title: 'MetaMask',
    icon: ico_metamask,
    tipExtension: 'Open the Metamask browser extension to connect your wallet.',
  },
  coinbase: {
    title: 'Coinbase',
    icon: ico_coinbase,
    tipExtension: 'Open the Coinbase browser extension to connect your wallet.',
    tipQrcode: 'Scan with Coinbase Wallet app.',
  },
  walletConnect: {
    title: 'WalletConnect',
    icon: ico_walletConnect,
    tipQrcode: 'Scan with any WalletConnect compatible app.',
  },
};
