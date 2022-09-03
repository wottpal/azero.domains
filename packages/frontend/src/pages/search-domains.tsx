import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import type { NextPage } from 'next'
import { useState } from 'react'
import { Button, Hero, Input, InputGroup } from 'react-daisyui'
import { SubmitHandler, useForm } from 'react-hook-form'

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

  const [available, setAvailable] = useState(false)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { domain } = data

    console.log(domain)
  }

  console.log(watch('domain')) // watch input value by passing the name of it

  return (
    <>
      <Hero>
        <Hero.Overlay className="bg-opacity-60" />
        <Hero.Content className="text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">
              Pick your favorite{' '}
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary-content to-error block">
                .azero domain
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
            <div className="py-4">
              <Button color="primary" variant="outline" size="md">
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
