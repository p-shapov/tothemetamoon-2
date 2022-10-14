import { ReactElement } from 'react';

import { ConnectorId } from 'services/WagmiClient/types';

import { ico_coinbase } from 'shared/icons/coinbase';
import { ico_metamask } from 'shared/icons/metamask';
import { ico_walletConnect } from 'shared/icons/wallet-connect';

export const connectButtonsData: Record<ConnectorId, { text: string; icon: ReactElement }> = {
  metamask: {
    text: 'Metamask',
    icon: ico_metamask,
  },
  coinbase: {
    text: 'Coinbase',
    icon: ico_coinbase,
  },
  walletConnect: {
    text: 'WalletConnect',
    icon: ico_walletConnect,
  },
};
