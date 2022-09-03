import { ApiPromise, HttpProvider } from '@polkadot/api'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'

export type PolkadotProviderContextType = {
  accounts?: InjectedAccountWithMeta[]
  api?: any
  setup?: () => Promise<void>
  actingAddress?: string
}
export const PolkadotProviderContext = createContext<PolkadotProviderContextType>({})

export const usePolkadotProviderContext = () => {
  return useContext(PolkadotProviderContext)
}

export const PolkadotProvider: FC<PropsWithChildren> = ({ children }) => {
  const [api, setApi] = useState<any>()
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [block, setBlock] = useState(0)
  const [lastBlockHash, setLastBlockHash] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [actingAddress, setActingAddress] = useState('')
  const [result, setResult] = useState('')
  const [gasConsumed, setGasConsumed] = useState('')
  const [outcome, setOutcome] = useState('')

  const extensionSetup = async () => {
    const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp')
    const extensions = await web3Enable('azero.domains')
    if (extensions.length === 0) return
    const account = await web3Accounts()
    setAccounts(account)
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

  // const getFlipValue = async () => {
  //   const contract = new ContractPromise(api, abi, contractAddress)
  //   const { gasConsumed, result, output } = await contract.query.get(actingAddress, {
  //     value: 0,
  //     gasLimit: -1,
  //   })
  //   setGasConsumed(gasConsumed.toHuman())
  //   setResult(JSON.stringify(result.toHuman()))
  //   if (output !== undefined && output !== null) {
  //     setOutcome(output.toHuman()?.toString() ?? '')
  //   }
  // }

  // const changeFlipValue = async () => {
  //   const { web3FromSource } = await import('@polkadot/extension-dapp')
  //   const contract = new ContractPromise(api, abi, contractAddress)
  //   const performingAccount = accounts[0]
  //   const injector = await web3FromSource(performingAccount.meta.source)
  //   const flip = await contract.tx.flip({ value: 0, gasLimit: -1 })
  //   if (injector !== undefined) {
  //     flip.signAndSend(performingAccount.address, { signer: injector.signer }, (result) => {
  //       if (result.status.isInBlock) {
  //         setResult('in a block')
  //       } else if (result.status.isFinalized) {
  //         setResult('finalized')
  //       }
  //     })
  //   }
  // }

  useEffect(() => {
    setup()
  }, [])

  return (
    <PolkadotProviderContext.Provider value={{ accounts, api, setup, actingAddress }}>
      {children}
    </PolkadotProviderContext.Provider>
  )
}
