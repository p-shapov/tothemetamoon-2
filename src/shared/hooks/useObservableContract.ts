import { GetContractArgs } from '@wagmi/core';
import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useContract, useProvider, useSigner } from 'wagmi';

export const useObservableContract = <T>(params: GetContractArgs) => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const contract = useContract<T>({ ...params, signerOrProvider: signer || provider });

  const observableContract = useLocalObservable(() => ({ value: contract }));

  useEffect(() => {
    runInAction(() => {
      observableContract.value = contract;
    });
  }, [contract, observableContract]);

  return observableContract;
};
