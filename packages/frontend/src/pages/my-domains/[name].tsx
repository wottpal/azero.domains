import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const ManageDomain: NextPage = () => {
  const router = useRouter()
  const { query } = router
  const { name } = query

  console.log(router.query.id)

  return (
    <div className="flex flex-col items-center justify-center overflow-x-auto">
      <h1 className="pb-12 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary-content to-error">
        Manage {name}
      </h1>

      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Card title!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageDomain
