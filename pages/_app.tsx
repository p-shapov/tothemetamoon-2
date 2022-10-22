import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import 'the-new-css-reset';
import 'shared/styles/global.scss';

import { WagmiClient } from 'services/WagmiClient';

import { Page } from 'shared/types/page';

import { StoreProvider } from 'store/context';

type AppPropsWithLayout = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <WagmiClient>
      <StoreProvider>{getLayout(<Component {...pageProps} />, pageProps)}</StoreProvider>
    </WagmiClient>
  );
}

export default MyApp;
