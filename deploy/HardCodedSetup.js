const { ethers } = require('hardhat');

var fs = require('fs').promises;
var results = [];
var commonTokenType;
var rareTokenType;
module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts,
  }) => {
    await main();
  };


async function main() {
    const {deployer, user1, user2} = await getNamedAccounts();
    commonTokenType = await hre.commonHardcodedTokenType;
    rareTokenType = await hre.rareHardcodedTokenType;
    const commonToken = await deployHardcodedCommonGameToken("CommonToken", "CT");
    const rareToken = await deployHardcodedCommonGameToken("RareToken", "RT");
    const poolSetup = await deployPoolSetup(commonToken, rareToken);
    await mintGameToken(commonToken, 8000000000000, commonTokenType);
    await mintGameToken(rareToken, 8000000000000, rareTokenType);
    await transferGameToken(commonToken, poolSetup.address, 2000000000000, commonTokenType);
    await transferGameToken(rareToken, poolSetup.address, 2000000000000, rareTokenType);
    await mintPool(poolSetup, 1600000000, 200000000);

    const gamer1 = await deployGamer("Gamer1", poolSetup);
    const gamer2 = await deployGamer("Gamer2", poolSetup);
    await transferOwnershipGamer("Gamer1", user1);
    await transferOwnershipGamer("Gamer2", user2);
    const commonBalance = await getBalanceOf(commonToken, deployer, commonTokenType);
    const rareBalance = await getBalanceOf(commonToken, deployer, rareTokenType);
    await transferGameToken(commonToken, gamer1.address, commonBalance, commonTokenType);
    await transferGameToken(rareToken, gamer2.address, rareBalance, rareTokenType);

    // await writeResultsToJson();
}

async function deployHardcodedCommonGameToken(name, symbol) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const commonToken = await deploy("CommonHardcodedToken", {
        from: deployer,
        contract: commonTokenType,
        args: [name, symbol]
    });
    console.log("Newly Deployed common Token: " + commonToken.newlyDeployed);
    console.log("Gas deployment common token: " + commonToken.receipt.gasUsed);
    appendDeploymentResult(name, commonToken.receipt.gasUsed);
    return commonToken;
};

async function mintGameToken(token, amount, tokenType) {
    const gameToken = await ethers.getContractFactory(tokenType);
    const commonToken = await gameToken.attach(
      token.address // The deployed contract address
    );
    const mintTx = await commonToken.mint(amount);
    const tx = await mintTx.wait();
    console.log("gas cost transaction =  " + tx.gasUsed);

    appendTransactionResult("mint gameToken: ", tx.gasUsed);
}

async function getBalanceOf(token, account, tokenType) {
    const gameToken = await ethers.getContractFactory(tokenType);
    const commonToken = await gameToken.attach(
      token.address // The deployed contract address
    );
    const balance = await commonToken.balanceOf(account);
    return balance;
}


async function transferGameToken(token, toAddress, amount, tokenType) {
    const gameTokenContract = await ethers.getContractFactory(tokenType);
    const gameToken = await gameTokenContract.attach(
      token.address // The deployed contract address
    );
    
    const transferTx = await gameToken.transfer(toAddress, amount);
    const tx = await transferTx.wait();
    console.log("gas cost transaction =  " + tx.gasUsed);

    appendTransactionResult("transfer gameToken: ", tx.gasUsed);
}

async function mintPool(poolSetup, amount0, amount1) {
    const poolSetupContract = await ethers.getContractFactory("PoolSetup");
    const poolSetupC = await poolSetupContract.attach(
        poolSetup.address // The deployed contract address
    );
    
    const mintTx = await poolSetupC.mintPool(amount0, amount1);
    const tx = await mintTx.wait();
    console.log("mint poolsetup =  " + tx.gasUsed);

    appendTransactionResult("mint poolsetup: ", tx.gasUsed);
}


async function deployPoolSetup(commonToken, rareToken) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const poolSetup = await deploy("PoolSetup", {
        from: deployer,
        args: [commonToken.address, rareToken.address],
    });

    console.log("Newly Deployed poolSetup: " + poolSetup.newlyDeployed);
    console.log("Gas deployment poolSetup: " + poolSetup.receipt.gasUsed);
    appendDeploymentResult("PoolSetup", poolSetup.receipt.gasUsed);
    return poolSetup;
}

async function deployGamer(name, poolSetup) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const gamer = await deploy(name, {
        from: deployer,
        contract: "Gamer",
        args: [poolSetup.address],
    });

    console.log("Newly Deployed gamer: " + gamer.newlyDeployed);
    console.log("Gas deployment gamer: " + gamer.receipt.gasUsed);
    appendDeploymentResult("Gamer", gamer.receipt.gasUsed);
    return gamer;
}

async function transferOwnershipGamer(name, user) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();   
    const GamerContract = await ethers.getContract(name, deployer);
    const transferOwnershipTx = await GamerContract.transferOwnership(user);
    const tx = await transferOwnershipTx.wait();
    console.log("gas cost transaction =  " + tx.gasUsed);
    appendTransactionResult("transferOwnershipGamer", tx.gasUsed);
}

async function appendDeploymentResult(string, data) {
    var obj = {
        contract: string,
        deployment: data.toString()
    };
    results.push(obj);
};

async function appendTransactionResult(string, data) {
    var obj = {
        function: string,
        transactionCost: data.toString()
    };
    results.push(obj);
};

async function writeResultsToJson() {
    var obj = {
        tokenType: commonTokenType,
        results: results,
    };
    await fs.appendFile("./Results/costHardcodedSetup.json", JSON.stringify(obj)+",", function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}

module.exports.tags = ['RawSetupHardcoded'];