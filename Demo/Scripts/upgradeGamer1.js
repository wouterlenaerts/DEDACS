var userMgr;
var results = [];
var fs = require('fs').promises;

task("upgradeGamer1", "Grant gamer1 from GameSetup the role 'level2'. ")
  .setAction(async (taskArgs, hre) => {
    const {ethers, deployments, getNamedAccounts} = hre;
    const {deployer, user1} = await getNamedAccounts(); 
    await getUserMgr();
    const GamerContract = await ethers.getContract('Gamer1');

    await grantRole(GamerContract.address, "level2");
    console.log("Gamer 1 now has the role 'level2'.");
});

async function getUserMgr() {
  const {deployer} = await getNamedAccounts();   
  const governanceManager = await ethers.getContract('GovernanceManager', deployer);
  userMgr = await governanceManager.getUserManager();
}

async function submitGovernanceTransaction(to, data) {
  console.log("Submit governance transaction.");
  const {deployer} = await getNamedAccounts();   
  const governanceManager = await ethers.getContract('GovernanceManager', deployer);
  const submitTx = await governanceManager.submitTransaction(to, 0, data);
  const tx = await submitTx.wait();
  // console.log("gas cost transaction =  " + data + " => " + tx.gasUsed);
  appendTransactionResult("data", tx.gasUsed);
  // console.log("end");
}

async function confirmGovernanceTransaction(number) {
  console.log("Confirm governance transaction.");
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();   
  const governanceManager = await ethers.getContract('GovernanceManager', deployer);
  const confirmTx = await governanceManager.confirmTransaction(number);
  const tx = await confirmTx.wait();
  // console.log("gas cost confirm transaction =  " + tx.gasUsed);
  appendTransactionResult("confirmTx", tx.gasUsed);
}

async function executeGovernanceTransaction(number) {
  console.log("Execute governance transaction.");
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();   
  const governanceManager = await ethers.getContract('GovernanceManager', deployer);
  const executeTx = await governanceManager.executeTransaction(number);
  const tx = await executeTx.wait();
  // console.log("gas cost execute transaction =  " + tx.gasUsed);
  appendTransactionResult("executeTx", tx.gasUsed);
}

async function getTransactionCount() {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();   
  const governanceManager = await ethers.getContract('GovernanceManager', deployer);
  const txCountTx = await governanceManager.getTransactionCount();
  return txCountTx;
}

async function submitConfirmExecuteTx(to, data) {
  await submitGovernanceTransaction(to, data);
  const number = await getTransactionCount();
  await confirmGovernanceTransaction(number-1);
  await executeGovernanceTransaction(number-1);
}

async function grantRole(userAddr, role) {
  // console.log("userAddr = " + userAddr);
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
  await submitConfirmExecuteTx(userMgr, data);
}

async function appendTransactionResult(string, data) {
  var obj = {
      function: string,
      transactionCost: data.toString()
  };
  results.push(obj);
};

async function writeResultsToJson(policyName) {
  var obj = {
      policy: policyName,
      results: results,
  };
  await fs.appendFile("./Results/costWithoutUseCase.json", JSON.stringify(obj)+",", function(err) {
      if (err) throw err;
      console.log('complete');
      }
  );
}

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts,
  }) => {
    await main();
  };
