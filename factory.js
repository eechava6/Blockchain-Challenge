const ethers = require('ethers');
const fs = require('fs')

// The Contract interface
let abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi').toString())
// The bytecode from Solidity, compiling the above source
let bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString()
// Connect to the network
let provider = new ethers.providers.JsonRpcProvider()

provider.listAccounts().then(result => console.log(result));

signer = provider.getSigner(0);

// Create an instance of a Contract Factory


// Deployment is asynchronous, so we use an async IIFE
(async function() {

    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abi, bytecode, signer);

    // Notice we pass in "Hello World" as the parameter to the constructor
    let contract = await factory.deploy([ethers.utils.formatBytes32String('Rama')
    , ethers.utils.formatBytes32String('Nick')
    , ethers.utils.formatBytes32String('Jose')])
    
     // The address the Contract WILL have once mined
     console.log(contract.address);
     // The transaction that was sent to the network to deploy the Contract
     console.log(contract.deployTransaction.hash);

    // The contract is NOT deployed yet; we must wait until it is mined
    await contract.deployed()

    // Done! The contract is deployed.
})();
