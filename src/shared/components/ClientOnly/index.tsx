import { FC, ReactNode } from 'react';

import { useIsSsr } from 'shared/hooks/useIsSsr';

export type ClientOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export const ClientOnly: FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const isSsr = useIsSsr();

  return <>{!isSsr ? children : fallback}</>;
};
