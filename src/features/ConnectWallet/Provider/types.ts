import type { Connector } from 'wagmi';

import { ConnectorId } from 'services/WagmiClient/types';

export type ModalName = 'connect' | ConnectorId;

export type ConnectWalletParams = {
  connector?: Connector;
};
