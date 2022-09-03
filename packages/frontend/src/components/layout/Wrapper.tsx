import { FC, PropsWithChildren } from 'react'

export const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-4 sm:(px-8 py-6) lg:py-8">
        {children}
      </div>
    </>
  )
}
