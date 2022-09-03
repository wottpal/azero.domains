import type { NextPage } from 'next'
import 'twin.macro'
import tw from 'twin.macro'

const Button = tw.button`m-2 px-2 py-1 rounded-lg border border-gray-400 text-gray-400 hover:text-white`

const HomePage: NextPage = () => {
  return <>Hello World</>
}

export default HomePage
