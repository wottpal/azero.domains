import { usePolkadotProviderContext } from '@components/PolkadotProvider'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import type { NextPage } from 'next'
import { useState } from 'react'
import { Button, Hero, Input, InputGroup } from 'react-daisyui'
import { SubmitHandler, useForm } from 'react-hook-form'
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
  const { api, account } = usePolkadotProviderContext()

  const [available, setAvailable] = useState(true)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { domain } = data
    if (!domain || !account) return

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

    console.log(domain)
  }

  console.log(watch('domain')) // watch input value by passing the name of it

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
        <Button type="submit" color="primary" size="lg">
          Search
        </Button>
      </form>
      <div className="py-5 flex flex-col items-center justify-center">
        {available ? (
          <>
            <div className="flex justify-center items-center space-x-2">
              <CheckCircleIcon className="h-7 w-7 text-success" />
              <p className=" text-success">Domain is available.</p>
            </div>
            <div className="py-8">
              <Button variant="outline" size="md">
                Buy Domain
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center space-x-2">
            <XCircleIcon className="h-7 w-7 text-error" />
            <p className=" text-error">Domain is taken.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default SearchDomains
