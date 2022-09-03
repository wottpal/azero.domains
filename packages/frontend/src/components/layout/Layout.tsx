import { FC, PropsWithChildren } from 'react'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="flex-grow">{children}</main>
    </>
  )
}
