# DEDACS
Framework for decentralized and dynamic access control for smart contracts

## _README under construction_

## Installation
### Installation for core deployment
```bash
npm install --save-dev hardhat
npm install @nomiclabs/hardhat-waffle
npm install --save-dev "@nomiclabs/hardhat-ethers@^2.0.0" "ethereum-waffle@^3.2.0" "ethers@^5.0.0"
npm install @nomiclabs/hardhat-web3
npm install hardhat-deploy
npm install hardhat-deploy-ethers
```

Now you can run the following command to startup a hardhat network
```bash
npx hardhat node --no-deploy
```

To be able to compile all necessary core solidity contracts you need to install the following libraries:
```bash
npm install @openzeppelin/contracts
npm install web3
```

Now you can run the following script to deploy the core contracts of DEDACS (without the demo contracts)
```bash
npx hardhat --network localhost deploy --reset --tags DeployCore
```


### Installation for demo
To install the DEDACS smart contracts and run its deploy and demoscripts on a hardhat blockchain, run the following commands:

```bash
npm install --save-dev hardhat
```
```bash
npm install @nomiclabs/hardhat-waffle
```
```bash
npm install --save-dev "@nomiclabs/hardhat-ethers@^2.0.0" "ethereum-waffle@^3.2.0" "ethers@^5.0.0"
```
```bash
npm install @nomiclabs/hardhat-web3
```
```bash
npm install hardhat-deploy
```
```bash
npm install hardhat-deploy-ethers
```
```bash
npm install @openzeppelin/contracts
```
```bash
npm install @uniswap/v3-core
```
```bash
npm install @uniswap/v3-periphery
```
```bash
npm install @uniswap/v3-core
```

## Deployment
This scenario describes the steps to be performed to deploy DEDACS on a local hardhat blockchain.

Start a hardhat blockchain without deploying any scripts:
```bash
npx hardhat node --no-deploy
```

npx hardhat --network localhost deploy --reset --tags DeployScript
npx hardhat --network localhost deploy --reset --tags DeployCore

To run the DEMO, you need to use the other config file which will compile more solidity contracts.
npx hardhat --config hardhat.config_demo.js --network localhost deploy --reset --tags DeployScript