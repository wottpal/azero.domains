import { FC, PropsWithChildren } from 'react'
import { usePolkadotProviderContext } from './PolkadotProvider'

export const Faq: FC<PropsWithChildren> = ({ children }) => {
  const { setup } = usePolkadotProviderContext()

  return (
    <div className="mx-auto max-w-7xl pt-64 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Are you new to Azero?</h2>
          <p className="mt-4 text-lg text-base-content">Get started in 3 simple steps.</p>
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <dl className="space-y-12">
            <div>
              <dt className="text-lg font-medium leading-6 text-primary">1. Get a Wallet</dt>
              <dd className="mt-2 text-base">
                Install the{' '}
                <a
                  target={'_blank'}
                  className="link link-secondary"
                  href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd"
                >
                  Aleph Zero browser extension (polkadot.js)
                </a>{' '}
                and create your testnet account.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium leading-6 text-primary">
                2. Get some Test Tokens
              </dt>
              <dd className="mt-2 text-base">
                Open the{' '}
                <a
                  target={'_blank'}
                  className="link link-secondary"
                  href="https://faucet.test.azero.dev/"
                >
                  testnet fauct
                </a>
                , paste your new testnet address and receive your TAZERO (testnet Azero).
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium leading-6 text-primary">3. Connect to Dapp</dt>
              <dd className="mt-2 text-base">
                <button
                  onClick={() => {
                    setup?.()
                  }}
                  className="link link-primary"
                >
                  Connect your wallet
                </button>{' '}
                to our dApp and buy your first Azero Domain.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
