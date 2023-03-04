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

Unfortunately, you have to change the pragma in the file  _node_modules\@openzeppelin\contracts\token\ERC20\IERC20.sol_ from 

```bash
pragma solidity ^0.8.0;
```
to 
```bash
pragma solidity >=0.7.0;
```
=> Also for ERC20 and ownable?
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

Open a new terminal that you can use to interact with the hardhat blockchain and run the commands depending on what you want to deploy or run. 

### Deploy Core Contracts
If you just want to deploy the Core contracts of DEDACS so you can interact with it from your own scripts run the following command:

```bash
npx hardhat --network localhost deploy --reset --tags DeployCore
```
You can leave out the --reset tag is you don't want to reset your previous deployments on the blockchain. The _DeployCore_ tag will run the script in _deploy/DeployCore.js_ .

### Deploy Demo Contracts

If you want to setup the Demo, run the following command:
```bash
npx hardhat --network localhost deploy --reset --tags DeployDemo
```
or this one if you need to work with an elaborated config file:
```bash 
npx hardhat --config hardhat.config_demo.js --network localhost deploy --reset --tags DeployDemo
```

The idea of this demo is that there are 2 resources (_Common token_ and _Rare token_) that are protected by DEDACS. There are 2 gamers in this demo that can exchange the resources through a Uniswap pool. Depending on the level they have, DEDACS will allow or block a transaction they want to do with the resources. 

### Interact with the Demo Contracts
The following tasks are defined for the demo:

```bash
npx hardhat --config hardhat.config_demo.js --network localhost swap --amount 100000 --commonforrare true
npx hardhat --config hardhat.config_demo.js --network localhost swapHardcoded --amount 100000 --commonforrare true
npx hardhat --config hardhat.config_demo.js --network localhost upgradeGamer1
```


npx hardhat --network localhost deploy --reset --tags DeployScript
npx hardhat --network localhost deploy --reset --tags DeployCore

To run the DEMO, you need to use the other config file which will compile more solidity contracts.
npx hardhat --config hardhat.config_demo.js --network localhost deploy --reset --tags DeployScript