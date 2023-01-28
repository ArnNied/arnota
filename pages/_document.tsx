import { Head, Html, Main, NextScript } from 'next/document';

export default function Document(): JSX.Element {
  return (
    <Html>
      <Head>
        <meta name='og:title' content='Arnota' />
        <meta
          name='description'
          content='Capture your ideas and collaborate with others with Arnota - the powerful note-taking application that makes sharing notes simple and efficient.'
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Nunito&family=Poppins&display=swap'
          rel='stylesheet'
        ></link>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body className='bg-light'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
