import { FC } from 'react'

export const Spinner: FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center overflow-x-auto my-28">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary"></div>
      </div>
    </>
  )
}
