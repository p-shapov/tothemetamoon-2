import type { NextPage } from 'next';
import type { ReactElement } from 'react';

export type Page<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props: P) => ReactElement;
};
