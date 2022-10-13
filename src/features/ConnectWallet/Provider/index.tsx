import { createContext, FC, ReactNode, useCallback } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';

import { ConnectWalletStore } from './store';
import { ConnectMediator } from '../containers/ConnectMediator';
import { useInitConnectWallet } from '../hooks/useInitConnectWallet';

export type ConnectWalletContextValue = {
  wagmi: {
    address?: string;
    isLoading: boolean;
    error: Error | null;
    connect(connector: Connector): void;
    disconnect(): void;
  };
  store: ConnectWalletStore;
};

export const ConnectWalletContext = createContext<ConnectWalletContextValue | null>(null);

export const ConnectWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const store = useInitConnectWallet();

  const { address } = useAccount();
  const {
    connect: wagmiConnect,
    isLoading,
    error,
  } = useConnect({
    onSuccess: () => store.setModal(null),
  });
  const { disconnect } = useDisconnect();

  const connect = useCallback((connector: Connector) => wagmiConnect({ connector }), [wagmiConnect]);

  return (
    <ConnectWalletContext.Provider
      value={{ store, wagmi: { address, isLoading, error, connect, disconnect } }}
    >
      {children}
      <ConnectMediator />
    </ConnectWalletContext.Provider>
  );
};
