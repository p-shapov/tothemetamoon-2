import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import { getEthRateInUsd } from 'api/controllers/eth';

import { Pair } from 'services/Pair';

import { formatToEth } from 'shared/utils/formatToEth';

export const useBalancePair = () => {
  const [pair, setPair] = useState<Pair>();

  const { address } = useAccount();
  const { data: balance } = useBalance({ addressOrName: address, watch: true });

  useEffect(() => {
    let canceled = false;

    const setPairAsync = async () => {
      const rate = await getEthRateInUsd();

      const pair = balance && new Pair(formatToEth(balance.value), rate);

      if (!canceled) setPair(pair);
    };

    setPairAsync();

    return () => {
      canceled = true;
    };
  }, [balance]);

  return pair;
};
