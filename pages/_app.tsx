import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

import 'the-new-css-reset';
import 'shared/styles/global.scss';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return getLayout(<Component {...pageProps} />, pageProps);
}

export default MyApp;
