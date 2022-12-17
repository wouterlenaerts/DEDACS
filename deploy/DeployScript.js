const { ethers } = require('hardhat');

var fs = require('fs').promises;
var results = [];
var commonPolicyType;
var rarePolicyType;
var userMgr;
var policyMgr;
var permissionMgr;
const web3 = new Web3;


module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts,
    hre
  }) => {
    await main();
  };


async function main() {
    const {deployer, user1, user2} = await getNamedAccounts();
    commonPolicyType = await hre.commonPolicyType;
    rarePolicyType = await hre.rarePolicyType;
    console.log("Deploy DEDACS.");
    const byteConversion = await deployByteConversion();
    await deployGovernanceManagerWithOneAdmin();
    await getUserMgr();
    await getPolicyMgr();
    await getPermissionMgr();
    console.log("Deploy 2 game tokens.");
    const commonToken = await deployGameToken("CommonToken", "CT", permissionMgr, byteConversion);
    const rareToken = await deployGameToken("RareToken", "RT", permissionMgr, byteConversion);
    console.log("Deploy 2 policies.");
    const commonPolicy = await deployCommonPolicy(byteConversion);
    const rarePolicy = await deployRarePolicy(byteConversion);
    await addUser(deployer, "deployer");
    await grantRole(deployer, "gameContract", "deployer");
    console.log("Add policies for resources in DEDACS.");
    await addPolicy(commonToken.address, "transferToken", commonPolicy.address, "commonToken");
    await addPolicy(rareToken.address, "transferToken", rarePolicy.address, "rareToken");

    console.log("Initiate Uniswap pool.");
    const poolSetup = await deployPoolSetup(commonToken ,rareToken);
    const poolAddr = await getPoolAddress();
    await addUser(poolSetup.address, "poolSetup");
    await addUser(poolAddr, "pool");
    await grantRole(poolSetup.address, "gameContract", "poolSetup");
    await grantRole(poolAddr, "gameContract", "pool");

    await mintGameToken(commonToken, 8000000000000, byteConversion);
    await mintGameToken(rareToken, 8000000000000, byteConversion);
    await transferGameToken(commonToken, poolSetup.address, 2000000000000, byteConversion);
    await transferGameToken(rareToken, poolSetup.address, 2000000000000, byteConversion);

    await mintPool(poolSetup, 1600000000, 200000000);

    console.log("Create gamers, add them as users to DEDACS and give them some tokens.");
    const gamer1 = await deployGamer("Gamer1", poolSetup);
    const gamer2 = await deployGamer("Gamer2", poolSetup);
    await transferOwnershipGamer("Gamer1", user1);
    await transferOwnershipGamer("Gamer2", user2);
    await addUser(gamer1.address, "gamer1");
    await addUser(gamer2.address, "gamer2");
    const commonBalance = await getBalanceOf(commonToken, deployer, byteConversion);
    const rareBalance = await getBalanceOf(commonToken, deployer, byteConversion);
    await transferGameToken(commonToken, gamer1.address, commonBalance, byteConversion);
    await transferGameToken(rareToken, gamer2.address, rareBalance, byteConversion);

    //Get signer object from address of user1
    const jsonRpcProvider =  new ethers.providers.JsonRpcProvider();
    const signer = jsonRpcProvider.getSigner(user1);
    const GamerContract = await ethers.getContract("Gamer1", deployer);
    const [gamerCommon, gamerRare] = await GamerContract.connect(signer).getGamerFunds();
    console.log("Gamer1 funds: ");
    console.log("Common tokens: " + gamerCommon);
    console.log("Rare tokens: " + gamerRare);
    // await writeResultsToJson(commonPolicyType);
}

async function deployByteConversion() {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const byteConversion = await deploy("ByteConversion", {
        from: deployer
    });
    // console.log("Gas deployment: " + byteConversion.receipt.gasUsed);
    appendDeploymentResult("ByteConversion", byteConversion.receipt.gasUsed);
    return byteConversion;
}

async function deployGovernanceManagerWithOneAdmin() {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const governanceManager = await deploy("GovernanceManager", {
        from: deployer,
        args: [[deployer], 1],
    });
    // console.log("Gas deployment: " + governanceManager.receipt.gasUsed);
    appendDeploymentResult("Governance Manager", governanceManager.receipt.gasUsed);
}


async function deployGameToken(name, symbol, permissionManagerAddr, byteConversion) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const commonToken = await deploy("GameToken", {
        from: deployer,
        libraries: {
            ByteConversion: byteConversion.address
        },
        args: [name, symbol, permissionManagerAddr]
    });
    // console.log("Newly Deployed gameToken: " + commonToken.newlyDeployed);
    // console.log("Gas deployment game token: " + commonToken.receipt.gasUsed);
    appendDeploymentResult(name, commonToken.receipt.gasUsed);
    return commonToken;
};

async function getUserMgr() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    userMgr = await governanceManager.getUserManager();
}

async function getPolicyMgr() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    policyMgr = await governanceManager.getPolicyManager();
}

async function getPermissionMgr() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    permissionMgr = await governanceManager.getPermissionManager();
}

async function getPoolAddress() {
    const {deployer} = await getNamedAccounts();   
    const poolSetup = await ethers.getContract('PoolSetup', deployer);
    const poolAdr = await poolSetup.getPool();
    return poolAdr;
}

async function deployCommonPolicy(byteConversion) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const commonPolicy = await deploy(commonPolicyType, {
        from: deployer,
        libraries: {
            ByteConversion: byteConversion.address
        },
        args: [governanceManager.address]
    });
    // console.log("common policy newly deployed = " +commonPolicy.newlyDeployed );
    // console.log("Gas deployment common policy: " + commonPolicy.receipt.gasUsed);
    appendDeploymentResult("commonPolicy", commonPolicy.receipt.gasUsed);
    return commonPolicy;
};

async function deployRarePolicy(byteConversion) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
       const rarePolicy = await deploy(rarePolicyType, {
        from: deployer,
        libraries: {
            ByteConversion: byteConversion.address
        },
        args: [governanceManager.address]
    });
    // console.log("rare policy newly deployed = " +rarePolicy.newlyDeployed );
    // console.log("Gas deployment rare policy: " +  rarePolicy.receipt.gasUsed);
    appendDeploymentResult("rarePolicy", rarePolicy.receipt.gasUsed);
    return rarePolicy;
};

async function submitGovernanceTransaction(to, data, description) {
    // console.log("submitGov");
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const submitTx = await governanceManager.submitTransaction(to, 0, data);
    const tx = await submitTx.wait();
    // console.log("gas cost transaction =  " + data + " => " + tx.gasUsed);
    appendTransactionResult("submitTx", tx.gasUsed, description);
}

async function confirmGovernanceTransaction(number, description) {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const confirmTx = await governanceManager.confirmTransaction(number);
    const tx = await confirmTx.wait();
    // console.log("gas cost confirm transaction =  " + tx.gasUsed);
    appendTransactionResult("confirmTx", tx.gasUsed, description);
}

async function executeGovernanceTransaction(number, description) {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const executeTx = await governanceManager.executeTransaction(number);
    const tx = await executeTx.wait();
    // console.log("gas cost execute transaction =  " + tx.gasUsed);
    appendTransactionResult("executeTx", tx.gasUsed, description);
}

async function getTransactionCount() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const txCountTx = await governanceManager.getTransactionCount();
    return txCountTx;
}

async function submitConfirmExecuteTx(to, data, description) {
    await submitGovernanceTransaction(to, data, description);
    const number = await getTransactionCount();
    await confirmGovernanceTransaction(number-1, description);
    await executeGovernanceTransaction(number-1, description);
}

async function addUser(userAddr, description) {
    const data = web3.eth.abi.encodeFunctionCall(
        {
            name: 'addUser',
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'user'
            }]
        }, [userAddr]);
    await submitConfirmExecuteTx(userMgr, data, "addUser: " + description);
}

async function grantRole(userAddr, role, description) {
    const data = web3.eth.abi.encodeFunctionCall(
        {
            name: 'grantRole',
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'user'
            },
            {
                type: 'string',
                name: 'role'
            }]
        }, [userAddr, role]);
    await submitConfirmExecuteTx(userMgr, data, "grantRole: "+role + "  " + description);
}

async function addPolicy(resourceAddr, operation, policyAddr, description) {
    const data = web3.eth.abi.encodeFunctionCall(
        {
            name: 'addPolicy',
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'resource'
            },
            {
                type: 'string',
                name: 'operation'
            },
            {
                type: 'address',
                name: 'policyAddress'
            }]
        }, [resourceAddr, operation, policyAddr]);
    await submitConfirmExecuteTx(policyMgr, data, "addPolicy: "+description);
}


async function deployPoolSetup(commonToken, rareToken) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const poolSetup = await deploy("PoolSetup", {
        from: deployer,
        args: [commonToken.address, rareToken.address],
    });

    // console.log("Newly Deployed poolSetup: " + poolSetup.newlyDeployed);
    // console.log("Gas deployment poolSetup: " + poolSetup.receipt.gasUsed);
    appendDeploymentResult("PoolSetup", poolSetup.receipt.gasUsed);
    return poolSetup;
}

async function mintGameToken(token, amount, byteConversion) {
    const gameToken = await ethers.getContractFactory("GameToken", 
        {
            libraries: {
                ByteConversion: byteConversion.address,
            },
        }
    );
    const commonToken = await gameToken.attach(
      token.address // The deployed contract address
    );
    const mintTx = await commonToken.mint(amount);
    const tx = await mintTx.wait();
    // console.log("gas cost transaction =  " + tx.gasUsed);

    appendTransactionResult("mint gameToken: ", tx.gasUsed);
}

async function getBalanceOf(token, account, byteConversion) {
    const gameToken = await ethers.getContractFactory("GameToken", 
        {
            libraries: {
                ByteConversion: byteConversion.address,
            },
        }
    );
    const commonToken = await gameToken.attach(
      token.address // The deployed contract address
    );
    const balance = await commonToken.balanceOf(account);
    return balance;
}


async function transferGameToken(token, toAddress, amount, byteConversion) {
    const gameTokenContract = await ethers.getContractFactory("GameToken", 
        {
            libraries: {
                ByteConversion: byteConversion.address,
            },
        }
    );
    const gameToken = await gameTokenContract.attach(
      token.address // The deployed contract address
    );
    
    const transferTx = await gameToken.transfer(toAddress, amount);
    const tx = await transferTx.wait();
    // console.log("gas cost transaction =  " + tx.gasUsed);

    appendTransactionResult("transfer gameToken: ", tx.gasUsed);
}

async function mintPool(poolSetup, amount0, amount1) {
    const poolSetupContract = await ethers.getContractFactory("PoolSetup");
    const poolSetupC = await poolSetupContract.attach(
        poolSetup.address // The deployed contract address
    );
    
    const mintTx = await poolSetupC.mintPool(amount0, amount1);
    const tx = await mintTx.wait();
    // console.log("mint poolsetup =  " + tx.gasUsed);

    appendTransactionResult("mint poolsetup: ", tx.gasUsed);
}

async function deployGamer(name, poolSetup) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const gamer = await deploy(name, {
        from: deployer,
        contract: "Gamer",
        args: [poolSetup.address],
    });

    // console.log("Newly Deployed gamer: " + gamer.newlyDeployed);
    // console.log("Gas deployment gamer: " + gamer.receipt.gasUsed);
    appendDeploymentResult("Gamer", gamer.receipt.gasUsed);
    return gamer;
}

async function transferOwnershipGamer(name, user) {
    const {deployer} = await getNamedAccounts();   
    const GamerContract = await ethers.getContract(name, deployer);
    const transferOwnershipTx = await GamerContract.transferOwnership(user);
    const tx = await transferOwnershipTx.wait();
    // console.log("gas cost transaction =  " + tx.gasUsed);
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

async function appendTransactionResult(string, data, descr) {
    var obj = {
        function: string,
        description: descr,
        transactionCost: data.toString()
    };
    results.push(obj);
};

async function writeResultsToJson(policyName) {
    var obj = {
        policy: policyName,
        results: results,
    };
    await fs.appendFile("./Results/costRawSetup.json", JSON.stringify(obj)+",", function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}

module.exports.tags = ['RawSetup'];