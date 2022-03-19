/*
 * @Author: Jiaming Cui
 * @Date: 2022-03-15 15:31:05
 * @LastEditTime: 2022-03-15 17:37:33
 * @FilePath: \firstNFT\scripts\deployMarket.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    let tokenAddr = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    let nftAddr = "";

    const marketFactory = await ethers.getContractFactory("Market");
    const market = await marketFactory.deploy(2, tokenAddr, nftAddr);

    console.log("Market address: ", market.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });