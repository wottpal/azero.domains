import { usePolkadotProviderContext } from '@components/PolkadotProvider'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { ContractPromise } from '@polkadot/api-contract'
import { truncateHash } from '@shared/truncateHash'
import type { NextPage } from 'next'
import { useState } from 'react'
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
  const { api, accounts, account } = usePolkadotProviderContext()
  const [isAvailable, setAvailable] = useState(false)
  const [isAvailableDomain, setAvailableDomain] = useState<string>()
  const [isAvailableDomainOwner, setAvailableDomainOwner] = useState<string>()

  const [checkIsLoading, setCheckIsLoading] = useState<boolean>(false)
  const [buyIsLoading, setBuyIsLoading] = useState<boolean>(false)

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
      const { web3FromSource } = await import('@polkadot/extension-dapp')
      const contract = new ContractPromise(
        api,
        await deployments.azns.abi,
        deployments.azns.address
      )
      const injector = await web3FromSource(account.meta.source)
      if (!injector?.signer) {
        toast.error('No signer')
        return
      }
      const { result, output } = await contract.query.getOwner(
        account.address,
        { gasLimit: -1 },
        domain
      )
      const owner = output?.toHuman() as any
      if (result.isOk && !output?.isEmpty && owner) {
        setAvailable(false)
        setAvailableDomain(domain)
        setAvailableDomainOwner(owner)
      } else {
        setAvailable(true)
        setAvailableDomain(domain)
        setAvailableDomainOwner(undefined)
      }
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
      const tsx = await contract.tx
        .register({ value: 0, gasLimit: -1 }, isAvailableDomain)
        .signAndSend(account.address, (result) => {
          console.log({ result })
        })
      toast.success(`Successfully bought ${isAvailableDomain}.azero`)
    } catch (e) {
      console.error('Error while buying', e)
      toast.error('Error while buying. Try again.')
    } finally {
      setBuyIsLoading(false)
    }
  }

  return (
    <>
      <Hero>
        <Hero.Content className="text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">
              Pick your favorite domain
              <br />
              <span className="mt-3 font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary-content to-error block">
                <Typewriter
                  options={{
                    strings: ['ethwarsaw.azero', 'antoni.azero', 'pepe.azero', 'adam.azero'],
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
                  Buy Domain for 50 $AZERO
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center space-x-2">
              <XCircleIcon className="h-7 w-7 text-error" />
              <p className=" text-error">
                Domain is taken by{' '}
                <span className="font-mono">{truncateHash(isAvailableDomainOwner)}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default SearchDomains
