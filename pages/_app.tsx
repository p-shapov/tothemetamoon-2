import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import 'the-new-css-reset';
import 'shared/styles/global.scss';

import { ConnectWalletProvider } from 'features/ConnectWallet/Provider';

import { WagmiClient } from 'services/WagmiClient';

import { Page } from 'shared/types/page';

type AppPropsWithLayout = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <WagmiClient>
      <ConnectWalletProvider>{getLayout(<Component {...pageProps} />, pageProps)}</ConnectWalletProvider>
    </WagmiClient>
  );
}

export default MyApp;
