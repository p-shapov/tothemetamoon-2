import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export const useObservableAddress = () => {
  const { address } = useAccount();

  const observableAddress = useLocalObservable(() => ({ value: address }));

  useEffect(() => {
    runInAction(() => {
      observableAddress.value = address;
    });
  }, [address, observableAddress]);

  return observableAddress;
};
