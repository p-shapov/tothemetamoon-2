import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { chains } from './chains';
import { ConnectorsMap } from './types';

export const connectors: ConnectorsMap = {
  metamask: new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true,
    },
  }),
  coinbase: new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'To the Metamoon',
      headlessMode: true,
      reloadOnDisconnect: false,
    },
  }),
  walletConnect: new WalletConnectConnector({
    chains,
    options: {
      qrcode: false,
    },
  }),
} as const;
