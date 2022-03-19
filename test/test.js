/*
 * @Author: Jiaming Cui
 * @Date: 2022-03-14 22:26:47
 * @LastEditTime: 2022-03-15 17:29:51
 * @FilePath: \firstNFT\test\test.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { showThrottleMessage } = require("@ethersproject/providers");

let owner, addr1;
let nft, hardhatToken, market;

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
        [owner, addr1] = await ethers.getSigners();
        console.log("owner address: ", owner.address);
        console.log("addr1 address: ", addr1.address);

        const Token = await ethers.getContractFactory("Token");
        hardhatToken = await Token.deploy();

        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        console.log("total supply:", await hardhatToken.totalSupply());
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);

        const amount = await hardhatToken.balanceOf(owner.address);
        expect(BigNumber.from("100")).to.equal(amount);

        // test symbol is equal to TKTN
        const symbol = await hardhatToken.symbol();
        expect("TKTN").to.equals(symbol);

        // transfer Token to addr1 first
        await hardhatToken.tokenTransfer(owner.address, addr1.address, 10);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equals(10);

        console.log("the remaining of addr1's balance is:", await hardhatToken.balanceOf(addr1.address));
        console.log("the remaining of owner's balance is:", await hardhatToken.balanceOf(owner.address));

        const mynft = await ethers.getContractFactory("MyNFT");
        nft = await mynft.deploy();

        const mint = await nft.safeMint(owner.address, 0);
        const ownToken = await nft.nftToOwner(0);

        expect(owner.address).to.equal(ownToken);

        // test symbol of nft
        const nftSymbol = await nft.symbol();
        expect("FTKN").to.equals(nftSymbol);

        console.log("addr1", addr1.address);
        const marketFactory = await ethers.getContractFactory("Market");
        market = await marketFactory.deploy(1, hardhatToken.address, nft.address);

        console.log("market address", market.address);
        const sale = await market.saleNFT(0, true);

        console.log("owner of tokenid o is", await nft.ownerOf(0));
        const res = await market.connect(addr1).buyNFT(0);
        expect(await market.nftBuyers(0)).to.equals(addr1.address);

    });

});