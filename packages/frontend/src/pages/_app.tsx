import { Layout } from '@components/layout/Layout'
import { PolkadotProvider } from '@components/PolkadotProvider'
import { env } from '@shared/environment'
import '@styles/global.css'
import '@styles/tailwind.css'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import { Toaster } from 'react-hot-toast'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* SEO */}
      <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="azero.domains"
        titleTemplate="%s | azero.domains"
        description="Domain Nameservice for Aleph Zero"
        openGraph={{
          type: 'website',
          locale: 'en',
          url: env.url,
          site_name: 'azero.domains',
          images: [
            {
              url: `${env.url}/og/og.jpg`,
              width: 1200,
              height: 670,
            },
          ],
        }}
        twitter={{
          handle: '@AzeroDomains',
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Plausible Analytics */}
        {env.isProduction && (
          <script
            defer
            data-domain="azero.domains"
            src="https://plausible.io/js/plausible.js"
          ></script>
        )}

        {/* Favicon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#00ccab" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#14202a" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <PolkadotProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PolkadotProvider>

      <Toaster />
    </>
  )
}

export default MyApp
