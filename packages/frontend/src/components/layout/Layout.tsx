import { FC, PropsWithChildren } from 'react'
import { Navigation } from './Navigation'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="flex-grow">
        <Navigation />
        {children}
      </main>
    </>
  )
}
