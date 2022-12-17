var fs = require('fs').promises;
var results = [];
var tokenType;

async function main() {
    await swap(true, 100000);
    await swap(false, 1000);
    await swap(false, 2000);
    await writeResultsToJson();
}

async function swap(commonForRare, amount) {
    const {ethers, deployments, getNamedAccounts} = hre;
    const {deployer, user1} = await getNamedAccounts(); 
    tokenType = await hre.commonHardcodedTokenType;
    const GamerContract = await ethers.getContract('Gamer1');

    //Get signer object from address of user1
    const jsonRpcProvider =  new ethers.providers.JsonRpcProvider();
    const signer = jsonRpcProvider.getSigner(user1);

    //Make the transaction from the signer account
    const swapTx = await GamerContract.connect(signer).swap(commonForRare, amount);
    const tx = await swapTx.wait();
    console.log("swap rare cost =  " + tx.gasUsed);
    await appendSwapResult(commonForRare, amount, tx.gasUsed);

    const [gamerCommon, gamerRare] = await GamerContract.connect(signer).getGamerFunds();
    console.log("gamer funds: " + gamerCommon + "; " + gamerRare);
}

async function appendSwapResult(commonForRare, amount, cost) {
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
        tokenType: tokenType,
        results: results
    };
    await fs.appendFile("./Results/evaluationDemoHardcoded.json", JSON.stringify(obj)+",", function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
