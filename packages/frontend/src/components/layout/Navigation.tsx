import { ConnectWallet } from '@components/ConnectWallet'
import Link from 'next/link'
import { FC, PropsWithChildren } from 'react'
import { Menu, Navbar } from 'react-daisyui'
import aznsLogoTransparent from '../../../public/icons/azns_logo_transparent.svg'

export const Navigation: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="pb-24 flex w-full component-preview p-4 items-center justify-center gap-2 font-sans">
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

            <Link passHref href={'/'}>
              <div className="flex cursor-pointer items-center justify-center">
                <img className="h-14 w-14 mr-2" src={aznsLogoTransparent.src} alt="AZNS Logo" />
                <a className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-base-content">
                  AZERO DOMAINS
                </a>
              </div>
            </Link>
          </Navbar.Start>
          <Navbar.Center className="hidden md:flex">
            <Menu horizontal className="p-0 space-x-4">
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
