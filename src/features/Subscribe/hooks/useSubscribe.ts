import { useContext } from 'react';

import { StoreContext } from 'store/context';

export const useSubscribe = () => {
  const store = useContext(StoreContext);

  if (store) return store.subscribe;

  throw new Error('Store initialization error');
};
