import { Confetti } from '@components/Confetti'
import { Faq } from '@components/Faq'
import { usePolkadotProviderContext } from '@components/PolkadotProvider'
import { CheckBadgeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { ContractPromise } from '@polkadot/api-contract'
import { truncateHash } from '@shared/truncateHash'
import { picasso } from '@vechain/picasso'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import Card from 'react-animated-3d-card'
import { Button, Hero, Input, InputGroup } from 'react-daisyui'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { deployments } from 'src/deployments'
import Typewriter from 'typewriter-effect'

type Inputs = {
  domain: string
}

const SearchDomains: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const domain = watch('domain')
  const { api, accounts, account, setup } = usePolkadotProviderContext()
  const [isAvailable, setAvailable] = useState(false)
  const [isAvailableDomain, setAvailableDomain] = useState<string>()
  const [isAvailableDomainOwner, setAvailableDomainOwner] = useState<string>()
  const [availableDomainIsYours, setAvailableDomainIsYours] = useState(false)
  const [domainMetadata, setDomainMetadata] = useState<{ [key: string]: string }>({})

  const [checkIsLoading, setCheckIsLoading] = useState<boolean>(false)
  const [buyIsLoading, setBuyIsLoading] = useState<boolean>(false)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!domain) {
      toast.error('No Domain given')
      return
    }
    if (!account || !api) {
      toast.error('Wallet not connected')
      return
    }
    setCheckIsLoading(true)

    try {
      const contract = new ContractPromise(
        api,
        await deployments.azns.abi,
        deployments.azns.address
      )
      const { result: ownerResult, output: ownerOutput } = await contract.query.getOwner(
        account.address,
        { gasLimit: -1 },
        domain
      )
      const owner = ownerOutput?.toHuman() as any
      if (!ownerResult.isOk || ownerOutput?.isEmpty || !owner) {
        setAvailable(true)
        setAvailableDomain(domain)
        setAvailableDomainOwner(undefined)
        setAvailableDomainIsYours(false)
        setDomainMetadata({})
        return
      }
      setAvailable(false)
      setAvailableDomain(domain)
      setAvailableDomainOwner(owner)
      setAvailableDomainIsYours(owner === account.address)

      // Fetch Metadata
      const { result: metadataResult, output: metadataOutput } = await contract.query.getAllRecords(
        account.address,
        { gasLimit: -1 },
        domain
      )
      const fetchedMetadata: string[][] = (metadataOutput?.toHuman() as any)?.['Ok'] || []
      const metadata = fetchedMetadata.reduce((acc: any, val: any) => {
        if (!val?.[0] || !val?.[1]) return acc
        return {
          ...acc,
          [val[0]]: val[1],
        }
      }, {})
      setDomainMetadata(metadata)
    } catch (e) {
      console.error('Error while checking', e)
      toast.error('Error while checking. Try again.')
    } finally {
      setCheckIsLoading(false)
    }
  }

  const buyAvailableDomain = async () => {
    if (!isAvailableDomain) {
      toast.error('No available domain chosen')
      return
    }
    if (!account || !api) {
      toast.error('Wallet not connected')
      return
    }
    setBuyIsLoading(true)
    setShowConfetti(false)

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
        setBuyIsLoading(false)
        return
      }
      api.setSigner(injector.signer)
      await contract.tx
        .register({ value: 50000000000000, gasLimit: -1 }, isAvailableDomain)
        .signAndSend(account.address)
      toast.success(`Successfully bought ${isAvailableDomain}.azero`)
      setShowConfetti(true)
      setAvailable(false)
      setAvailableDomainOwner(account.address)
      setAvailableDomainIsYours(true)
    } catch (e) {
      console.error('Error while buying', e)
      toast.error('Error while buying. Try again.')
    } finally {
      setBuyIsLoading(false)
    }
  }

  return (
    <div className="pt-14">
      <Hero>
        <Hero.Content className="text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">
              Pick your favorite domain
              <br />
              <span className="mt-4 font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-base-content block">
                <Typewriter
                  options={{
                    strings: [
                      'ethwarsaw.azero',
                      'wojak.azero',
                      'antoni.azero',
                      'pepe.azero',
                      'adam.azero',
                    ],
                    delay: 75,
                    cursorClassName: 'text-error',
                    loop: true,
                    autoStart: true,
                  }}
                />
              </span>
            </h1>
          </div>
        </Hero.Content>
      </Hero>
      <form onSubmit={handleSubmit(onSubmit)} className="py-6 flex items-center justify-center">
        <div className="pr-4">
          <InputGroup>
            <Input
              {...register('domain', { required: true })}
              width={4}
              bordered
              placeholder="awesomedomain"
              size="lg"
            />
            <span>.azero</span>
          </InputGroup>
        </div>
        <Button type="submit" color="primary" size="lg" disabled={!domain} loading={checkIsLoading}>
          Search
        </Button>
      </form>
      {!!isAvailableDomain && (
        <div className="py-5 flex flex-col items-center justify-center">
          {isAvailable && isAvailableDomain ? (
            <>
              <div className="flex justify-center items-center space-x-2">
                <CheckCircleIcon className="h-7 w-7 text-success" />
                <p className=" text-success">Domain is available</p>
              </div>
              <div className="py-8">
                <Button
                  variant="outline"
                  size="md"
                  loading={buyIsLoading}
                  onClick={buyAvailableDomain}
                >
                  Buy Domain for 50 $TAZERO
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center space-x-2">
              {availableDomainIsYours ? (
                <>
                  <CheckBadgeIcon className="h-7 w-7 text-success" />
                  <p className="text-success">
                    Domain is yours.{' '}
                    <Link href={`/my-domains/${isAvailableDomain}`} passHref>
                      <a className="underline font-bold">Manage it.</a>
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-7 w-7 text-error" />
                  <p className="text-error">
                    Domain is taken by{' '}
                    <span className="font-mono">{truncateHash(isAvailableDomainOwner)}</span>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {showConfetti && <Confetti />}
      <div className="flex flex-col items-center mt-10">
        <Card
          style={{
            background: '#ddd',
            width: '400px',
            height: '250px',
            cursor: 'pointer',
          }}
          onClick={() => console.log('Card clicked')}
        >
          <div
            className="w-24 h-24 rounded-full m-2"
            style={{
              background: `no-repeat url('data:image/svg+xml;utf8,${picasso(
                '0xf6e78a5584c06e2dec5c675d357f050a5402a730'
              )}')`,
              backgroundSize: `100%`,
            }}
          />
        </Card>
      </div>
      <Faq />
    </div>
  )
}

export default SearchDomains
