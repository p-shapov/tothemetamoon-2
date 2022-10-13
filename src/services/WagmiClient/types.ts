import { Connector } from 'wagmi';

export type ConnectorId = 'metamask' | 'coinbase' | 'walletConnect';

export type ConnectorsMap = Record<ConnectorId, Connector>;
