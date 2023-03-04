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



# Demo

The idea of this demo is that there are 2 resources (_Common token_ and _Rare token_) that are protected by DEDACS. There are 2 gamers in this demo that can exchange the resources through a Uniswap pool. Depending on the level they have, DEDACS will allow or block a transaction they want to do with the resources. 

Once the Demo is deployed, you can interact with it through 2 tasks: _swap_ and _upgradeGamer1_.

The _swap_ task takes 2 arguments: _amount_ and _commonforrare_. _amount_ is the amount of tokens you want to swap and _commonforrare_ declares the swap direction. If _commonforrare_ is true, _Common tokens_ will be swapped for _Rare tokens_ and vice versa if it is false. 

The _upgradeGamer1_ task will upgrade the level of _Gamer 1_ to level 2 which will give him more rights. 

The _Common token_ can be swapped unlimited by everyone as declared in the _CommonTokenPolicy_. Gamers can swap at most 1000 _Rare tokens_ at the same time or at most 2000 _Rare tokens_ at the same time if they are in level 2. 

## Example
The third transaction will be blocked by DEDACS because it violates the _RareTokenPolicy_. However if gamer1 has level 2, which will be the case after the fourth transaction, the third transaction does not violate the policy anymore so if you try it again, it will not be blocked anymore by DEDACS.

```bash
npx hardhat --config hardhat.config_demo.js --network localhost swap --amount 100000 --commonforrare true

npx hardhat --config hardhat.config_demo.js --network localhost swap --amount 200 --commonforrare false

npx hardhat --config hardhat.config_demo.js --network localhost swap --amount 1500 --commonforrare false

npx hardhat --config hardhat.config_demo.js --network localhost upgradeGamer1

npx hardhat --config hardhat.config_demo.js --network localhost swap --amount 1500 --commonforrare false
```

 












### Other demo commands

```bash
npx hardhat --config hardhat.config_demo.js --network localhost swap --amount 100000 --commonforrare true
npx hardhat --config hardhat.config_demo.js --network localhost swapHardcoded --amount 100000 --commonforrare true
npx hardhat --config hardhat.config_demo.js --network localhost upgradeGamer1
```


npx hardhat --network localhost deploy --reset --tags DeployScript
npx hardhat --network localhost deploy --reset --tags DeployCore

To run the DEMO, you need to use the other config file which will compile more solidity contracts.
npx hardhat --config hardhat.config_demo.js --network localhost deploy --reset --tags DeployScript