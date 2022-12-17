var fs = require('fs').promises;
var results = [];
var policyName = "";
var userMgr;
async function main() {
    await swap(true, 100000);
    console.log("swap1");
    await swap(false, 1000);
    console.log("swap2");
    await upgradeGamer1();
    await swap(false, 2000);
    await writeResultsToJson();
}

async function swap(commonForRare, amount) {
    const {ethers, deployments, getNamedAccounts} = hre;
    const {deployer, user1} = await getNamedAccounts(); 
    const GamerContract = await ethers.getContract('Gamer1');
    await getUserMgr();
    policyName = await hre.commonPolicyType;
    
    //Get signer object from address of user1
    const jsonRpcProvider =  new ethers.providers.JsonRpcProvider();
    const signer = jsonRpcProvider.getSigner(user1);

    //Make the transaction from the signer account
    const swapTx = await GamerContract.connect(signer).swap(commonForRare, amount);
    const tx = await swapTx.wait();
    console.log("swap rare cost =  " + tx.gasUsed);
    await appendSwapResult(policyName, commonForRare, amount, tx.gasUsed);

    const [gamerCommon, gamerRare] = await GamerContract.connect(signer).getGamerFunds();
    console.log("gamer funds: " + gamerCommon + "; " + gamerRare);
}

async function appendSwapResult(policyName, commonForRare, amount, cost) {
    var obj = {
        function: "swap",
        commonForRare: commonForRare,
        amount: amount,
        transactionCost: cost.toString()
    };
    results.push(obj);
};

async function writeResultsToJson() {
    var obj = {
        policyName: policyName,
        results: results
    }
    await fs.appendFile("./Results/evaluationDemo.json", JSON.stringify(obj)+",", function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}

async function upgradeGamer1() {
    const {ethers, deployments, getNamedAccounts} = hre;
    const {deployer, user1} = await getNamedAccounts(); 

    const GamerContract = await ethers.getContract('Gamer1');
    await grantRole(GamerContract.address, "level2");
}

async function getUserMgr() {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    userMgr = await governanceManager.getUserManager();
  }

async function grantRole(userAddr, role) {  
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

async function submitGovernanceTransaction(to, data) {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const submitTx = await governanceManager.submitTransaction(to, 0, data);
    const tx = await submitTx.wait();
    console.log("gas cost transaction =  " + data + " => " + tx.gasUsed);
    appendTransactionResult("submitTx upgrade gamer1", tx.gasUsed);
}

async function confirmGovernanceTransaction(number) {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const confirmTx = await governanceManager.confirmTransaction(number);
    const tx = await confirmTx.wait();
    console.log("gas cost confirm transaction =  " + tx.gasUsed);
    appendTransactionResult("confirmTx upgrade gamer1", tx.gasUsed);
}

async function executeGovernanceTransaction(number) {
    const {deployer} = await getNamedAccounts();   
    const governanceManager = await ethers.getContract('GovernanceManager', deployer);
    const executeTx = await governanceManager.executeTransaction(number);
    const tx = await executeTx.wait();
    console.log("gas cost execute transaction =  " + tx.gasUsed);
    appendTransactionResult("executeTx upgrade gamer1", tx.gasUsed);
}

async function getTransactionCount() {
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

async function appendTransactionResult(string, data) {
    var obj = {
        function: string,
        transactionCost: data.toString()
    };
    results.push(obj);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
