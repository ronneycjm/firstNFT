/*
 * @Author: Jiaming Cui
 * @Date: 2022-03-15 15:27:52
 * @LastEditTime: 2022-03-16 21:43:07
 * @FilePath: \firstNFT\scripts\deployNFT.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */

const { ethers } = require("hardhat");

/*
 * @Author: Jiaming Cui
 * @Date: 2022-03-14 22:53:44
 * @LastEditTime: 2022-03-15 15:09:20
 * @FilePath: \firstNFT\scripts\deploy.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
async function main() {

    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const nftFactory = await ethers.getContractFactory("MyNFT");
    const nft = await nftFactory.deploy();

    await nft.deployed();

    console.log("NFT address:", nft.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });