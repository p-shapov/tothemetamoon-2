import { FC, ReactNode } from 'react';
import { createClient, WagmiConfig } from 'wagmi';

import { provider, webSocketProvider } from './chains';
import { connectors } from './connectors';

const client = createClient({
  autoConnect: true,
  connectors: [connectors.metamask, connectors.coinbase, connectors.walletConnect],
  provider,
  webSocketProvider,
});

export const WagmiClient: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
);
