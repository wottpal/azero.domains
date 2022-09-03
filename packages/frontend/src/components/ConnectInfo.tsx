import { FC } from 'react'
import { ConnectWallet } from './ConnectWallet'

export const ConnectInfo: FC = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center overflow-x-auto my-28">
        <div className="text-xl text-center max-w-prose mb-10 ">
          Make sure to connect your wallet first
        </div>
        <ConnectWallet />
      </div>
    </>
  )
}
