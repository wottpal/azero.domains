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
      setDomainMetadata({})
    } catch (e) {
      console.error('Error while buying', e)
      toast.error('Error while buying. Try again.')
    } finally {
      setBuyIsLoading(false)
    }
  }

  console.log('Domain Metadata', domainMetadata)

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
      {isAvailableDomainOwner && (
        <div className="flex flex-col items-center mt-10">
          <Card
            style={{
              background: '#ddd',
              width: '400px',
              height: 'auto',
              cursor: 'pointer',
              padding: '1rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
            }}
            onClick={() => console.log('Card clicked')}
            key={`${isAvailableDomain}${isAvailableDomainOwner}${JSON.stringify(domainMetadata)}`}
          >
            <div className="flex items-center justify-start">
              {/* Identicon */}
              <div
                className="w-24 h-24 rounded-full mr-4"
                style={{
                  background: `no-repeat url('data:image/svg+xml;utf8,${picasso(
                    isAvailableDomainOwner || ''
                  )}')`,
                  backgroundSize: `100%`,
                }}
              />
              <div className="flex flex-col">
                <p className="pr-6 text-2xl font-semibold tracking-tighter text-base-200">
                  {isAvailableDomain}
                </p>
                <p className="text-sm text-base-200/60">{truncateHash(isAvailableDomainOwner)}</p>
              </div>
            </div>
            <div
              className="px-4 flex flex-col space-y-4"
              style={{
                paddingTop: Object.keys(domainMetadata || {})?.length ? '1rem' : '0',
              }}
            >
              {/* Twitter */}
              {domainMetadata?.twitter && (
                <div className="flex items-center space-x-2">
                  <svg
                    fill="text-primary"
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                  <p className="text-base-200 font-semibold">{domainMetadata?.twitter}</p>
                </div>
              )}
              {/* Discord */}
              {domainMetadata?.discord && (
                <div className="flex items-center space-x-2">
                  <svg
                    fill="text-primary"
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Discord</title>
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                  </svg>
                  <p className="text-base-200 font-semibold">{domainMetadata?.discord}</p>
                </div>
              )}
              {/* Telegram */}
              {domainMetadata?.telegram && (
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-8 h-8"
                    fill="text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512"
                  >
                    <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"></path>
                  </svg>
                  <p className="text-base-200 font-semibold">{domainMetadata?.telegram}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
      <Faq />
    </div>
  )
}

export default SearchDomains
