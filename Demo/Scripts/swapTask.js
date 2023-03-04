var fs = require('fs').promises;
var results = [];
var policyName;


task("swap", "Swap tokens from a Gamer account to the pool from the GameSetup")
  .addParam("commonforrare", "Boolean that should be True if you want to swap common tokens for rare tokens, false for swapping in the opposite direction.")
  .addParam("amount", "The amount you want to swap.")
  .setAction(async (taskArgs, hre) => {
    const commonForRare = (taskArgs.commonforrare === 'true');
    // console.log("commonForRare = " + commonForRare);
    const amount = taskArgs.amount;

    const {ethers, deployments, getNamedAccounts} = hre;
    const {deployer, user1} = await getNamedAccounts(); 
    policyName = await hre.commonPolicyType;
    const GamerContract = await ethers.getContract('Gamer1');
    
    //Get signer object from address of user1
    const jsonRpcProvider =  new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const signer = jsonRpcProvider.getSigner(user1);
    // console.log("signer = "+signer.address);

    //Make the transaction from the signer account
    const swapTx = await GamerContract.connect(signer).swap(commonForRare, amount);
    const tx = await swapTx.wait();
    // console.log("swap rare cost =  " + tx.gasUsed);
    // await appendTransactionResult(policyName, commonForRare, amount, tx.gasUsed);
    // await writeResultsToJson();

    const [gamerCommon, gamerRare] = await GamerContract.connect(signer).getGamerFunds();
    // console.log("gamer funds: " + gamerCommon + "; " + gamerRare);
    console.log("Gamer1 funds: ");
    console.log("Common tokens: " + gamerCommon);
    console.log("Rare tokens: " + gamerRare);
});


async function appendTransactionResult(policyName, commonForRare, amount, cost) {
    results = [];
    var obj = {
        policyName: policyName,
        commonForRare: commonForRare,
        amount: amount,
        transactionCost: cost.toString()
    };
    results.push(obj);
};

async function writeResultsToJson() {
    await fs.appendFile("./Results/swaps.json", JSON.stringify(results), function(err) {
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
