import { ConnectWallet } from '@components/ConnectWallet'
import Link from 'next/link'
import { FC, PropsWithChildren } from 'react'
import { Menu, Navbar } from 'react-daisyui'

export const Navigation: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="pb-40 flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
        <Navbar>
          <Navbar.Start>
            {/* TODO: Convert to Healdess UI */}
            {/* <Dropdown>
              <Button color="ghost" tabIndex={0} className="lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </Button>
              <Dropdown.Menu tabIndex={0} className="w-52 menu-compact mt-3">
                <Dropdown.Item>
                  <Link href="/search-domains">
                    <a>Search Domains</a>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link href="/my-domains">
                    <a>My Domains</a>
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            <a className="btn btn-ghost normal-case text-xl">azero Domains</a>
          </Navbar.Start>
          <Navbar.Center className="hidden lg:flex">
            <Menu horizontal className="p-0">
              <Menu.Item>
                <Link href="/">
                  <a>Search Domains</a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/my-domains">
                  <a>My Domains</a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/substrate">
                  <a>Test</a>
                </Link>
              </Menu.Item>
            </Menu>
          </Navbar.Center>
          <Navbar.End>
            <ConnectWallet />
          </Navbar.End>
        </Navbar>
      </div>
    </>
  )
}
