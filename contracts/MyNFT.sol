/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    uint256 public _tokenId;
    uint256[] public nftsArray;
    mapping(uint256 => address) public nftToOwner;

    constructor() ERC721("MyNFT", "FTKN") {}

    function safeMint(address to, uint256 tokenId)
        public
        payable
        returns (uint256)
    {
        _safeMint(to, tokenId);
        nftToOwner[tokenId] = to;
        nftsArray.push(tokenId);
        return tokenId;
    }

    function getLength() public view returns (uint256) {
        return nftsArray.length;
    }
}
