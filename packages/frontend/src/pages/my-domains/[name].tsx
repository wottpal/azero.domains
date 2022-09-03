import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button } from 'react-daisyui'
import { SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  address: string
  twitter: string
  telegram: string
  discord: string
}

const ManageDomain: NextPage = () => {
  const router = useRouter()
  const { query } = router
  const { name } = query

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  return (
    <div className="flex flex-col items-center justify-center overflow-x-auto">
      <h1 className="pb-12 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary-content to-error">
        Manage your azero domain
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-[43rem] mb-12 bg-base-200 shadow-xl"
      >
        <div className="card-body">
          <h2 className="pb-4 font-semibold text-primary text-2xl">{name}.azero</h2>
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
