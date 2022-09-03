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
  twitter: string
  telegram: string
  discord: string
  lens: string
}

const ManageDomain: NextPage = () => {
  const router = useRouter()
  const { query } = router
  const { name: domain } = query
  const { api, account } = usePolkadotProviderContext()
  const [checkIsLoading, setCheckIsLoading] = useState<boolean>(true)
  const [saveIsLoading, setSaveIsLoading] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState(false)

  // Output error and push fallback route
  const routeToFallback = (customMessage?: string, customDestination?: string) => {
    toast.error(customMessage || `Can't verify ownership of '${domain}' for authenticated account.`)
    router.push(customDestination || '/my-domains')
    setCheckIsLoading(false)
    setIsOwner(false)
  }

  // Metadata Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Inputs>()

  // Update Metadata
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!account || !api) {
      toast.error('Wallet not connected')
      return
    }
    const newMetadata = [
      ...(!!data?.twitter ? [['twitter', data.twitter]] : []),
      ...(!!data?.telegram ? [['telegram', data.telegram]] : []),
      ...(!!data?.discord ? [['discord', data.discord]] : []),
      ...(!!data?.lens ? [['lens', data.lens]] : []),
    ]
    console.log('Updating metadata…', newMetadata)
    setSaveIsLoading(true)
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
        setSaveIsLoading(false)
        return
      }
      api.setSigner(injector.signer)
      await contract.tx
        .setAllRecords({ value: 0, gasLimit: -1 }, domain, newMetadata)
        .signAndSend(account.address)
      toast.success(`Successfully updated metadata`)
    } catch (e) {
      console.error('Error while updating metadata', e)
      toast.error('Error while updating metadata. Try again.')
    } finally {
      setSaveIsLoading(false)
    }
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
      const contract = new ContractPromise(
        api,
        await deployments.azns.abi,
        deployments.azns.address
      )
      // Fetch owner
      const { result: ownerResult, output: ownerOutput } = await contract.query.getOwner(
        account.address,
        { gasLimit: -1 },
        domain
      )
      const owner = ownerOutput?.toHuman() as any
      if (!ownerResult.isOk || ownerOutput?.isEmpty || !owner) {
        routeToFallback(`Domain '${domain}' doesn't have an owner yet. Go buy it!`, '/')
        return
      }
      if (owner !== account.address) {
        routeToFallback()
        return
      }
      setIsOwner(true)

      // Fetch metadata
      const { result: metadataResult, output: metadataOutput } = await contract.query.getAllRecords(
        account.address,
        { gasLimit: -1 },
        domain
      )
      const fetchedMetadata = (metadataOutput?.toHuman() as any)?.['Ok'] || []
      for (const meta of fetchedMetadata) {
        if (!meta?.[0] || !meta?.[1]) continue
        setValue(meta[0], meta?.[1])
      }
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

  if (checkIsLoading) return <Spinner />
  if (!checkIsLoading && !account) return <ConnectInfo />
  if (!isOwner) return null

  return (
    <div className="flex flex-col items-center justify-center overflow-x-auto">
      <h1 className="pb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-base-content">
        <span className="text-sm font-semibold uppercase text-gray-400 mb-4 block">
          Manage your Domain
          <br />
        </span>
        <span className="text-3xl font-extrabold font-display">{domain}.azero</span>
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg w-[43rem] mb-12 border shadow-xl"
      >
        <div className="card-body">
          {/* <h2 className="pb-4 font-semibold text-primary text-2xl">{domain}.azero</h2> */}
          <div className="grid items-center gap-5 grid-cols-4">
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
                placeholder="azerodomains"
                className="input input-bordered w-full"
              />
            </label>
            {/* Telegram */}
            <p className="col-span-1">Telegram</p>
            <input
              {...register('telegram')}
              className="input input-bordered w-full col-span-3"
              type="text"
              placeholder="azerodomains"
            />
            {/* Discord */}
            <p className="col-span-1">Discord</p>
            <input
              {...register('discord')}
              className="input input-bordered w-full col-span-3"
              type="text"
              placeholder="wojak#1337"
            />
            {/* Lens Protocol */}
            <p className="col-span-1">Lens</p>
            <label className="input-group col-span-3">
              <span>@</span>
              <input
                {...register('lens')}
                type="text"
                placeholder="stani_loves_gradient"
                className="input input-bordered w-full"
              />
              <span>.lens</span>
            </label>
          </div>
          <div className="pt-6 card-actions justify-end">
            <Button loading={isSubmitting} color="primary">
              Save Metadata
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ManageDomain
