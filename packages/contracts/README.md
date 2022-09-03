# Contracts for azero.domains

Local development env: 
1. [node](https://github.com/paritytech/substrate-contracts-node#note)
3. [ui](https://contracts-ui.substrate.io/)
make sure to select local node

## scripts

```bash
# build
# builds a bundle, abi and wasm blob in target/ink
cargo +nightly contract build
cargo +nightly contract build --release

# test 
cargo +nightly test
```
