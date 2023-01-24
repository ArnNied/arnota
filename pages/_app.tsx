import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';

// import { Provider } from 'react-redux';

// import { store } from '@/store/store';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Arnota</title>
      </Head>
      {/* <Provider store={store}> */}
      <Component {...pageProps} />
      {/* </Provider> */}
    </>
  );
}
