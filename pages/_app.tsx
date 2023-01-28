import '@/styles/globals.css';

import Head from 'next/head';
import type { AppProps } from 'next/app';

// import { Provider } from 'react-redux';

// import { store } from '@/store/store';

// TODO: Remove title in this file and add it to each page
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
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
