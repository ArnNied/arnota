import '@/styles/globals.scss';

import Head from 'next/head';
import { Provider } from 'react-redux';

import AuthContextProvider from '@/lib/context/AuthContextProvider';
import { store } from '@/store/store';

import type { AppProps } from 'next/app';

// TODO: Remove title in this file and add it to each page
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Arnota</title>
      </Head>
      <Provider store={store}>
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </Provider>
    </>
  );
}
