import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useConnect } from 'wagmi';

import { ConnectWalletStore } from '../Provider/store';
import { ConnectWalletParams } from '../Provider/types';

export const useInitConnectWallet = () => {
  const { pendingConnector } = useConnect();

  const params = useLocalObservable<ConnectWalletParams>(() => ({
    connector: pendingConnector,
  }));

  useEffect(() => {
    runInAction(() => {
      params.connector = pendingConnector;
    });
  }, [params, pendingConnector]);

  return useMemo(() => new ConnectWalletStore(params), [params]);
};
