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

## What it does

The **azero-domains** dapp creates decentralized domains as NFTs on the Aleph Zero testnet. The frontend interacting with the smart contracts is deployed on the Arweave network for maximum censorship resistance. The user journey with the Azero Domains app is as follows. First, the user checks if his desired domain is still available with the search function. If yes, he can purchase & claim the domain in just one click. 


## How we built it

Frontend: 
Dennis :

## Challenges we ran into
- Polkadot JS Implementation --> its weird
-  

## Accomplishments that we're proud of
- 
## What we learned
- How to write smart contracts with Ink! in Rust

## What's next for Azero Domains

- integrating the following features:
- marketplace?
- trading of domains
- NFT connection

Tech:
- mainnet deployment
- upgradable smart contracts
- 


