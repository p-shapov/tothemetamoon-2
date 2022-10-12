import type { ReactElement } from 'react';
import type { NextPage } from 'next';

declare global {
  type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement, props: P) => ReactElement;
  };
}
