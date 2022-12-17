require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy-ethers");
require("./scripts/swapTask.js");
require("./scripts/swapTaskHardcoded.js");
require("./scripts/upgradeGamer1.js");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


extendEnvironment((hre) => {
  hre.commonPolicyType = "CommonTokenPolicy";
  hre.rarePolicyType = "RareTokenPolicy";
  hre.commonHardcodedTokenType = "EnvironmentToken";
  hre.rareHardcodedTokenType = "EnvironmentToken";
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  paths: [
    {
      sources: "./Uniswap/contracts"
    },
    {
      sources: "./contracts"
    }
  ],
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
    },
    user1: {
      default: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // here this will by default take the first account as deployer
    },
    user2: {
      default: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', // here this will by default take the first account as deployer
    }
  }
};
