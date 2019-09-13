# Blockchain-Challenge
Marketplace which accepts criptocurrency.

-> [User Stories](stories.md):

-> [Architecture](architecture.md):

## Running the app: 

### Prerequisites

* NodeJs (NPM)

### Installing the dependencies: 

* `npm i -g ganacha-cli` (In-memory blockchain)
* `npm i -g solc` (Javascript bindings to Solidity compiler)
* `npm i -g truffle` (Framework for Ethereum)
* `npm i` Extra dependencias

### Runnning the app: 

* ganache-cli -p 7545 (Run a local blockchain on port 7545) 
* truffle compile (Compile .sol files) 
* truffle migrate (Deploys contract to Ethereum network)
* npm run dev (Run application on port 3000) 

This application used the following sources: 

https://medium.com/zastrin/build-an-ethereum-dapp-using-ethers-js-c561f9c4dd2f
https://www.trufflesuite.com/tutorials/pet-shop
https://solidity.readthedocs.io/en/v0.4.24/introduction-to-smart-contracts.html
https://www.codementor.io/rogargon/exercise-simple-solidity-smart-contract-for-ethereum-blockchain-m736khtby
