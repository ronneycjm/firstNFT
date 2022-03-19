/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./MyNFT.sol";

contract Market {
    uint256 price;
    Token public token;
    MyNFT public nft;

    //keep the address of the nft buyer
    mapping(uint256 => address) public nftBuyers;

    // token for sale status
    mapping(uint256 => bool) public tokenForSale;

    constructor(
        uint256 _price,
        address _tokenAddress,
        address _nftAddress
    ) {
        price = _price;
        token = Token(_tokenAddress);
        nft = MyNFT(_nftAddress);
    }

    function saleNFT(uint256 _tokenId, bool isSale) external {
        require(
            msg.sender == nft.ownerOf(_tokenId),
            "not the owner of this token"
        );
        tokenForSale[_tokenId] = isSale;
    }

    function buyNFT(uint256 tokenId) public payable returns (bool) {
        require(tokenForSale[tokenId], "token is not for sale");
        require(token.balanceOf(msg.sender) >= 1, "price not meet requirement");

        token.tokenTransfer(msg.sender, nft.ownerOf(tokenId), 1);
        nftBuyers[tokenId] = msg.sender;

        return true;
    }
}
