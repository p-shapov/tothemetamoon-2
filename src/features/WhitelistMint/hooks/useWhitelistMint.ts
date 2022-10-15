import { useContext } from 'react';

import { StoreContext } from 'store/context';

export const useWhitelistMint = () => {
  const store = useContext(StoreContext);

  if (!store) throw new Error('Store initialization error');

  return store.whitelistMint;
};
