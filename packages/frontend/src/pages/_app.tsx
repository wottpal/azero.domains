import { Layout } from '@components/layout/Layout'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import { Toaster } from 'react-hot-toast'
import '../styles/tailwind.css'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* SEO TODO */}
      {/* <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="TODO"
        titleTemplate="%s | TODO"
        description="TODO"
        openGraph={{
          type: 'website',
          locale: 'en',
          url: env.url,
          site_name: 'TODO',
          images: [
            {
              url: `${env.url}/og/TODO.jpg`,
              width: 1200,
              height: 670,
            },
          ],
        }}
        twitter={{
          handle: '@TODO',
        }}
      /> */}

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Favicon TODO */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" /> */}
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>

      <Toaster />
    </>
  )
}

export default MyApp
