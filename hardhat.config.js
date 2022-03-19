/*
 * @Author: Ronnie Cui
 * @Date: 2022-03-17 18:49:41
 * @LastEditTime: 2022-03-19 17:48:02
 * @FilePath: \firstNFT\hardhat.config.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: process.env.URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
