// import
//main function
//calling of main function



// function deployFunc(){
//     console.log("Hi!!");
// }

// module.exports.default = deployFunc();

// module.exports = async (hre) =>{

//     const {getNamedAccounts, deployments} = hre
//     //hre.getNamedAccounts
//     //hre.deployments

// }
 const {developmentChains,networkConfig} = require("../helper-hardhat-config")
 const {network} = require("hardhat")
 const {verify} = require("../utils/verify")
// const helperConfig = require("../helper-hardhat-config")
//const networkConfig = helperConfig.networkConfig


module.exports = async({getNamedAccounts, deployments}) =>{
    const { deploy, log} = deployments
    const { deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress 
    if(developmentChains.includes(network.name)){
        const ethUsdAggrigator  = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggrigator.address
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe",
    {
        from: deployer,
        args: [ethUsdPriceFeedAddress],// put price feed Address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)
    {
        //verify
        await verify(fundMe.address, args)
    }
    log("sssssssssss")
}
module.exports.tags= ["all", "fundme"]
