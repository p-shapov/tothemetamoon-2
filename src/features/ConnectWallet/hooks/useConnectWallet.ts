import { useContext } from 'react';

import { ConnectWalletContext } from '../Provider';

export const useConnectWallet = () => {
  const store = useContext(ConnectWalletContext);

  if (!store) throw new Error('Must be used inside ConnectWalletProvider');

  return store;
};
