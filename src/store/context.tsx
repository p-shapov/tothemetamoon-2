import { createContext, FC, ReactNode, useMemo } from 'react';

import { ConnectWalletStore } from 'features/ConnectWallet/store';

export type StoreContextValue = {
  connectWallet: ConnectWalletStore;
};

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const connectWallet = useMemo(() => new ConnectWalletStore(), []);

  return <StoreContext.Provider value={{ connectWallet }}>{children}</StoreContext.Provider>;
};
