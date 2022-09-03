import type { NextPage } from 'next'
import Link from 'next/link'
import { Button, Table } from 'react-daisyui'

const myDomains = [
  {
    id: 1,
    name: 'test',
    address: '0x123',
  },
  {
    id: 2,
    name: 'test2',
    address: '0x123',
  },
]

const MyDomains: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center overflow-x-auto">
      <h1 className="pb-12 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-base-content">
        Domain Overview
      </h1>
      <Table className=" rounded">
        <Table.Head className="bg-primary/70">
          <span />
          <span>Domains</span>
          <span>Address</span>
          <span>Actions</span>
        </Table.Head>

        <Table.Body>
          {myDomains.map((domain, index) => (
            <Table.Row className="bg-base-200" key={domain.id} hover>
              <span>{index + 1}</span>
              <span>{domain.name}</span>
              <span>{domain.address}</span>
              <span>
                <div className="flex space-x-4">
                  <Link href={`my-domains/${domain.name}`}>
                    <a className="bxtn btn-sm">Manage</a>
                  </Link>
                  <Button color="error" size="sm">
                    Release Domain
                  </Button>
                </div>
              </span>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover">
              <th>2</th>
              <td className="bg-primary">Hart Hagerty</td>
              <td className="bg-primary">Desktop Support Technician</td>
              <td className="bg-primary">Purple</td>
            </tr>
            <tr className="hover ">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  )
}

export default MyDomains
