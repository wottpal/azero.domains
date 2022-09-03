import { FC, PropsWithChildren } from 'react'

export const CenterBody: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="h-full flex flex-col justify-center items-center relative">{children}</main>
    </>
  )
}
