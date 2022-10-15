import { useRouter, NextRouter } from 'next/router';

import { Path } from '../types';

export const useRouterPush = () => {
  const router = useRouter();

  return (to: Path, as: Parameters<NextRouter['push']>[1], options?: Parameters<NextRouter['push']>[2]) =>
    router.push(to, as, options);
};
