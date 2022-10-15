import { useContext } from 'react';

import { StoreContext } from 'store/context';

export const useClaimAirdrop = () => {
  const store = useContext(StoreContext);

  if (!store) throw new Error('Store initialization error');

  return store.claimAirdrop;
};
