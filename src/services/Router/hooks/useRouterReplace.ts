import { useRouter, NextRouter } from 'next/router';

import { Path } from '../types';

export const useRouterReplace = () => {
  const router = useRouter();

  return (
    to: Path,
    as: Parameters<NextRouter['replace']>[1],
    options?: Parameters<NextRouter['replace']>[2],
  ) => router.replace(to, as, options);
};
