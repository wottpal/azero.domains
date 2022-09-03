import { truncateHash } from '@shared/truncateHash'
import { FC } from 'react'
import { Button } from 'react-daisyui'
import { usePolkadotProviderContext } from './PolkadotProvider'

export interface ConnectWalletProps {}
export const ConnectWallet: FC<ConnectWalletProps> = () => {
  const { setup, accounts } = usePolkadotProviderContext()
  return (
    <>
      <Button
        color="primary"
        disabled={!!accounts?.length}
        onClick={() => {
          setup?.()
        }}
      >
        {!!accounts?.length ? (
          <div className="flex flex-col">
            <div className="text-base-content">{accounts[0].meta.name}</div>
            <div className="text-xs text-primary">{truncateHash(accounts[0].address, 42)}</div>
          </div>
        ) : (
          <>Connect Wallet</>
        )}
      </Button>
    </>
  )
}
