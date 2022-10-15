import { useContext } from 'react';

import { StoreContext } from 'store/context';

export const useConnectWallet = () => {
  const store = useContext(StoreContext);

  if (!store) throw new Error('Store initialization error');

  return store.connectWallet;
};
