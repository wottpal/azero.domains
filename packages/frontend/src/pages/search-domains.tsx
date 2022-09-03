import type { NextPage } from 'next'
import { Button, Hero, Input, InputGroup } from 'react-daisyui'

const SearchDomains: NextPage = () => {
  return (
    <>
      <Hero>
        <Hero.Overlay className="bg-opacity-60" />
        <Hero.Content className="text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">
              Pick your favorite{' '}
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary-content to-error block">
                .azero domain
              </span>
            </h1>
          </div>
        </Hero.Content>
      </Hero>
      <div className="py-6 flex items-center justify-center">
        <div className="pr-4">
          <InputGroup>
            <Input width={4} bordered placeholder="awesomedomain" size="lg" />
            <span>.azero</span>
          </InputGroup>
        </div>
        <Button color="primary" size="lg">
          Search
        </Button>
      </div>
    </>
  )
}

export default SearchDomains
