const { ethers } = require('hardhat');

var fs = require('fs').promises;
var results = [];
var userMgr;
var policyMgr;
var permissionMgr;

module.exports = async ({
  }) => {
    await main();
  };


async function main() {
    console.log("Deploy DEDACS.");
    const byteConversion = await deployByteConversion();
    const governanceManager = await deployGovernanceManagerWithOneAdmin();
    const userManager = await getUserMgr();
    const policyManager = await getPolicyMgr();
    const permissionManager = await getPermissionMgr();
    const environmentMgr = await getEnvironmentMgr();

    console.log("DEDACS Deployed");
    console.log("Governance Manager: ", governanceManager.address);
    console.log("Permission Manager: ", permissionManager);
    console.log("User Manager: ", userManager);
    console.log("Policy Manager: ", policyManager);
    console.log("Environment Manager: ", environmentMgr);
    console.log("ByteConversion Library: ", byteConversion.address);
}

async function deployByteConversion() {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const byteConversion = await deploy("ByteConversion", {
        from: deployer
    });
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
    appendDeploymentResult("Governance Manager", governanceManager.receipt.gasUsed);
    return governanceManager;
}


async function getUserMgr() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    userMgr = await governanceManager.getUserManager();
    return userMgr;
}

async function getPolicyMgr() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    policyMgr = await governanceManager.getPolicyManager();
    return policyMgr;
}

async function getPermissionMgr() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    permissionMgr = await governanceManager.getPermissionManager();
    return permissionMgr;
}

async function getEnvironmentMgr() {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const environmentMgr = await governanceManager.getEnvironmentManager();
    return environmentMgr;
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
    await fs.appendFile("./Results/deployScript.json", JSON.stringify(obj)+",", function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}


module.exports.tags = ['DeployCore'];