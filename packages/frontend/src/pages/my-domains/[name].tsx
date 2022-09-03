import { ConnectInfo } from '@components/ConnectInfo'
import { usePolkadotProviderContext } from '@components/PolkadotProvider'
import { Spinner } from '@components/Spinner'
import { ContractPromise } from '@polkadot/api-contract'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from 'react-daisyui'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { deployments } from 'src/deployments'

type Inputs = {
  address: string
  twitter: string
  telegram: string
  discord: string
}

const ManageDomain: NextPage = () => {
  const router = useRouter()
  const { query } = router
  const { name: domain } = query
  const { api, account } = usePolkadotProviderContext()
  const [checkIsLoading, setCheckIsLoading] = useState<boolean>(true)
  const [isOwner, setIsOwner] = useState(false)

  const routeToFallback = (customMessage?: string, customDestination?: string) => {
    toast.error(customMessage || `Can't verify ownership of '${domain}' for authenticated account.`)
    router.push(customDestination || '/my-domains')
    setCheckIsLoading(false)
    setIsOwner(false)
  }

  // Check for owner of domain
  const checkIfOwner = async () => {
    if (!domain || !api || !account) {
      setCheckIsLoading(false)
      setIsOwner(false)
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
        routeToFallback('No signer')
        return
      }
      const { result, output } = await contract.query.getOwner(
        account.address,
        { gasLimit: -1 },
        domain
      )
      const owner = output?.toHuman() as any
      if (!result.isOk || output?.isEmpty || !owner) {
        console.log('here1')
        routeToFallback(`Domain '${domain}' doesn't have an owner yet. Go buy it!`, '/')
        return
      }
      if (owner !== account.address) {
        console.log('here2')
        routeToFallback()
        return
      }
      setIsOwner(true)
    } catch (e) {
      console.error('Error while checking', e)
      routeToFallback()
    } finally {
      setCheckIsLoading(false)
    }
  }
  useEffect(() => {
    checkIfOwner()
  }, [domain, account])

  // Fetch current metadata
  const fetchMetadata = async () => {
    if (!isOwner || !domain || !account || !api) return
    // TODO
  }
  useEffect(() => {
    fetchMetadata()
  }, [isOwner, domain, account])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  if (checkIsLoading) return <Spinner />
  if (!checkIsLoading && !account) return <ConnectInfo />
  if (!isOwner) return null

  return (
    <div className="flex flex-col items-center justify-center overflow-x-auto">
      <h1 className="pb-12 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-base-content">
        Manage your azero domain
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-[43rem] mb-12 bg-base-200 shadow-xl"
      >
        <div className="card-body">
          <h2 className="pb-4 font-semibold text-primary text-2xl">{domain}.azero</h2>
          <div className="grid items-center gap-5 grid-cols-4">
            {/* Address */}
            <p className="col-span-1">Address</p>
            <input
              {...register('address')}
              className="input input-bordered w-full col-span-3"
              type="text"
              placeholder="5GdxaSEUH475FctEGeTUsbSbbXAZt1Ah287nQ8EqNryWHrms"
            />
            {/* <p className="col-span-3 overflow-x-clip">
              5GdxaSEUH475FctEGeTUsbSbbXAZt1Ah287nQ8EqNryWHrms
            </p> */}
            {/* Twitter */}
            <p className="col-span-1">Twitter</p>
            <label className="input-group col-span-3">
              <span>@</span>
              <input
                {...register('twitter')}
                type="text"
                placeholder="awesometwitter"
                className="input input-bordered w-full"
              />
            </label>
            {/* Telegram */}
            <p className="col-span-1">Telegram</p>
            <input
              {...register('telegram')}
              className="input input-bordered w-full col-span-3"
              type="text"
              placeholder="awesometelegram"
            />
            {/* Discord */}
            <p className="col-span-1">Discord</p>
            <input
              {...register('discord')}
              className="input input-bordered w-full col-span-3"
              type="text"
              placeholder="awesomediscord#1234"
            />
          </div>
          <div className="py-4 card-actions justify-end">
            <Button loading={isSubmitting} color="primary">
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ManageDomain
