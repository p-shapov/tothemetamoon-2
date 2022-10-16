import { useContext } from 'react';

import { StoreContext } from 'store/context';

export const useGetWhitelisted = () => {
  const store = useContext(StoreContext);

  if (store) return store.getWhitelisted;

  throw new Error('Store initialization error');
};
