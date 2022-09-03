import type { NextPage } from 'next'
import { Button } from 'react-daisyui'

const HomePage: NextPage = () => {
  return (
    <>
      <p className="text-primary text-3xl">Hello World</p>
      <Button color="primary">Click me!</Button>
    </>
  )
}

export default HomePage
