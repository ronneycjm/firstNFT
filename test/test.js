/*
 * @Author: Jiaming Cui
 * @Date: 2022-03-14 22:26:47
 * @LastEditTime: 2022-03-22 20:28:41
 * @FilePath: \firstNFT\test\test.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { showThrottleMessage } = require("@ethersproject/providers");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

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

    it("merkle tree test", async () => {
        let wl = [
            '0x169841AA3024cfa570024Eb7Dd6Bf5f774092088',
            '0xc12ae5Ba30Da6eB11978939379D383beb5Df9b33',
            '0x0a290c8cE7C35c40F4F94070a9Ed592fC85c62B9',
            '0x43Be076d3Cd709a38D2f83Cd032297a194196517',
            '0xC7FaB03eecA24CcaB940932559C5565a4cE9cFFb',
            '0xE4336D25e9Ca0703b574a6fd1b342A4d0327bcfa',
            '0xeDcB8a28161f966C5863b8291E80dDFD1eB78491'
        ];

        let leafNodesArray = wl.map(address => keccak256(address));
        let tree = new MerkleTree(leafNodesArray, keccak256, { sortPairs: true });
        console.log("tree node:", tree.getHexRoot());
        console.log(tree.toString());

        // verify address is in the wl or not
        const claimAddrHash = leafNodesArray[0];
        const hexProof = tree.getHexProof(claimAddrHash);
        console.log("claim address hash is:", claimAddrHash.toString('hex'));
        console.log("hex proof is:", hexProof);

        const badAddrHash = keccak256('0x169841AA3024cfa570024Eb7Dd6Bf5f774092087');
        const badHexProof = tree.getHexProof(badAddrHash);
        console.log("bad merkle proof is:", badHexProof);
    });

});