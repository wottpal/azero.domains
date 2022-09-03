# azero.domains – Domain Nameservice for Aleph Zero

This is a hackathon project built at ETHWarsaw by [@dennis_zoma](https://twitter.com/dennis_zoma), [@mike1third](https://twitter.com/mike1third), [@cryptoneur_eth](https://twitter.com/cryptoneur_eth), and [@atris_eth](https://twitter.com/atris_eth).

## Getting Started

```bash
# Install pnpm
npm i -g pnpm

# Install dependencies
pnpm install

# Copy & fill environments
cp packages/frontend/.env.local.example packages/frontend/.env.local
# cp packages/contracts/.env.example packages/contracts/.env
```

## Development

I reommend developing in VSCode by opening the workspace file located at `.vscode/azns.code-workspace` and installing recommended plugins listed in `.vscode/extensions.json`.

```bash
# Generate contract-types, start local hardhat node, and start frontend with turborepo
pnpm dev

# Only start frontend
pnpm frontend:dev
```

## Deployment

We are deploying to the Permaweb via Arweave, Bundlr, and arkb (see https://docs.arweave.org/developers/tools/textury-arkb).

```bash
# 1. Create a Bundlr Wallet & load it with some tokens

# 2. Place a `wallet.json` with your private key into `./packages/frontend/`

# 3. Inside of the `frontend` package execute
pnpm run deploy
```






## Devpost Description 

## Inspiration

Web3 and the overall Crypto ecosystem need to strive for simplicity and the best user experience possible. One significant improvement to achieve this goal has been the introduction of the Ethererum domains by the Ethereum Name Service (ENS). Thereby, the representation of the wallet address consisting of hexadecimal characters is abstracted away with a simple domain. 

Aleph Zero is an L1 blockchain whose technical specifications offer a new level of user experience with near-to-zero transaction costs and sub-second transaction finality. We believe that we can enhance the UX even more by introducing our decentralized **.azero** domains. 

This innovation will make it easier for users to navigate the Aleph Zero ecosystem. The domain reduces human error. Sending a transaction to the wrong **.azero** domain is less likely than with an address in hexadecimal characters. This reduces the fear of new users interacting with the web3 ecosystem. Further, using our domains makes sending payments and any other interactions more efficient and convenient. 

## What it does

The **azero-domains** dapp creates decentralized domains as NFTs on the Aleph Zero testnet. The frontend interacting with the smart contracts is deployed on the Permaweb network by Arweave for maximum censorship resistance. The user journey with the Azero Domains app is as follows. First, the user checks if his desired domain is still available with the search function. If yes, he can purchase & claim the domain in just one click. If the user is not yet connected with his wallet, he will be redirected to do so. After the successfull purchase with TAZERO tokens, the user's new domain is shown in his dashboard. He now has the option to 'manage' or 'release' any possessed domain. Managing the domain allows for adding web2 social handles such as from Twitter, Discord or Telegram and from web3 networks such as Lens Protocol as metadata to the NFT. The dapp will also provide a dynamic visual representation of the new domain and the added social handles in form of a contact card. Thereby, our domain system also works as a contact book for all your friends in web3. 


## How we built it

### Frontend

For the frontend we used `Next.js` as a framework, with it's many production ready features like page-based routing and the possiblity to easily export 

Dennis :

### Contracts
We used the ink! eDSL by Parity for Substrate-compatible smart contracts. Since ink! is just Rust with some macros and a WASM build target, even though we didn't have prior experience building SCs in Rust, we were able to quickly get productive by leveraging existing Rust infra and community.

## Challenges we ran into
- Polkadot JS Implementation --> its weird
- Polkadot JS and UI is not ready for SSR

## Accomplishments that we're proud of
- Building and deploying a working and well-tested naming and digital profile service in the span of one day.
- Going from beginner Rust knowledge to being productive with ink!


## What we learned
- How to write smart contracts for Substrate with ink!
- How to leverage existing Rust infrastructure for testing and deploying ink! smart contracts
- How to interface with the chain using Polkadot.js, including both reads and writes
- 

## What's next for Azero Domains

After the successfull testnet deplyoment during the hackathon, we are awaiting the samrt contract mainnet deployment by the Aleph Zero team to ship azero.domains on to mainnet with. 

- integrating the following features:
- marketplace?
- trading of domains
- NFT-compatiblity 

Tech:
- mainnet deployment
- upgradable smart contracts
- 
