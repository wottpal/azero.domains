import { ApiPromise, HttpProvider } from '@polkadot/api'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'

export type PolkadotProviderContextType = {
  accounts?: InjectedAccountWithMeta[]
  account?: InjectedAccountWithMeta
  api?: ApiPromise
  setup?: () => Promise<void>
}
export const PolkadotProviderContext = createContext<PolkadotProviderContextType>({})

export const usePolkadotProviderContext = () => {
  return useContext(PolkadotProviderContext)
}

export const PolkadotProvider: FC<PropsWithChildren> = ({ children }) => {
  const [api, setApi] = useState<any>()
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [account, setAccount] = useState<InjectedAccountWithMeta>()

  const extensionSetup = async () => {
    const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp')
    const extensions = await web3Enable('azero.domains')
    if (extensions.length === 0) return
    const _accounts = await web3Accounts()
    setAccounts(_accounts)
    setAccount(!!_accounts?.length ? _accounts[0] : undefined)
  }

  const setup = async () => {
    // const wsProvider = new WsProvider('wss://ws.test.azero.dev')
    const httpProvider = new HttpProvider('https://rpc.test.azero.dev')
    const api = await ApiPromise.create({ provider: httpProvider })
    // await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    //   setBlock(lastHeader.number.toNumber())
    //   setLastBlockHash(lastHeader.hash.toString())
    // })
    setApi(api)
    await extensionSetup()
  }

  useEffect(() => {
    setup()
  }, [])

  return (
    <PolkadotProviderContext.Provider value={{ accounts, account, api, setup }}>
      {children}
    </PolkadotProviderContext.Provider>
  )
}
