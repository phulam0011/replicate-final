import '@/styles/base.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from "next/head";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Luận văn tốt nghiệp</title>
        <link rel="icon" href="https://e-learning.hcmut.edu.vn/theme/image.php/boost/theme/1685588876/favicon" style={{}}/>

      </Head>
      <main className={inter.variable}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
