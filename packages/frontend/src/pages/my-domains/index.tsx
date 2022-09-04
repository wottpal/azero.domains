import { ConnectInfo } from '@components/ConnectInfo'
import { usePolkadotProviderContext } from '@components/PolkadotProvider'
import { Spinner } from '@components/Spinner'
import { ContractPromise } from '@polkadot/api-contract'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Table } from 'react-daisyui'
import toast from 'react-hot-toast'
import { deployments } from 'src/deployments'

const MyDomains: NextPage = () => {
  const [myDomains, setMyDomains] = useState<string[]>([])
  const { api, account } = usePolkadotProviderContext()
  const [domainsIsLoading, setDomainsIsLoading] = useState<boolean>(true)
  const [releaseIsLoading, setReleaseIsLoading] = useState<boolean>(false)

  // Fetch domains for connected account
  const fetchMyDomains = async () => {
    if (!api || !account) {
      setDomainsIsLoading(false)
      return
    }
    setDomainsIsLoading(true)
    try {
      const contract = new ContractPromise(
        api,
        await deployments.azns.abi,
        deployments.azns.address
      )
      const { result, output } = await contract.query.getNamesOfAddress(
        account.address,
        { gasLimit: -1 },
        account.address
      )
      const domains = output?.toHuman() as any
      if (!result.isOk || output?.isEmpty || !domains?.length) {
        setMyDomains([])
        return
      }
      setMyDomains(domains)
    } catch (e) {
      console.error('Error while checking', e)
    } finally {
      setDomainsIsLoading(false)
    }
  }
  useEffect(() => {
    fetchMyDomains()
  }, [account])

  // Release Domain
  const releaseDomain = async (domain: string) => {
    if (!domain) return
    if (!account || !api) {
      toast.error('Wallet not connected')
      return
    }
    setReleaseIsLoading(true)
    try {
      const { web3FromSource } = await import('@polkadot/extension-dapp')
      const contract = new ContractPromise(
        api,
        await deployments.azns.abi,
        deployments.azns.address
      )
      const injector = await web3FromSource(account.meta.source)
      if (!injector?.signer) {
        toast.error('No signer')
        setReleaseIsLoading(false)
        return
      }
      api.setSigner(injector.signer)
      await contract.tx.release({ value: 0, gasLimit: -1 }, domain).signAndSend(account.address)
      toast.success(`Successfully released domain`)
      await new Promise((res) => setTimeout(res, 2000))
      fetchMyDomains()
    } catch (e) {
      console.error('Error while releasing domain', e)
      toast.error('Error while releasing domain. Try again.')
    } finally {
      setReleaseIsLoading(false)
    }
  }

  if (domainsIsLoading || releaseIsLoading) return <Spinner />
  if (!account) return <ConnectInfo />
  if (myDomains?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center overflow-x-auto my-28">
        <div className="text-xl text-center max-w-prose mb-10 ">
          You do not have any domains yet..
        </div>
        <div>
          <Link href="/">
            <a className="btn btn-primary">Buy first domain</a>
          </Link>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col items-center justify-center overflow-x-auto">
      <h1 className="pb-12 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-base-content">
        Domain Overview
      </h1>
      <Table className="rounded">
        <Table.Head className="bg-primary/70">
          <span />
          <span>Domains</span>
          <span>Actions</span>
        </Table.Head>

        <Table.Body>
          {myDomains.map((domain, index) => (
            <Table.Row className="bg-base-200" key={`${index}-${domain}`} hover>
              <span>#{index + 1}</span>
              <span>{domain}</span>
              <span>
                <div className="flex space-x-4">
                  <Link href={`my-domains/${domain}`}>
                    <a className="btn btn-sm">Manage</a>
                  </Link>
                  <button
                    className="btn btn-error btn-sm text-base-content"
                    onClick={() => {
                      const isConfirmed = confirm(
                        `Are you sure you want to release '${domain}'? This action can't be undone.`
                      )
                      if (isConfirmed) releaseDomain(domain)
                    }}
                  >
                    Release Domain
                  </button>
                </div>
              </span>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default MyDomains
