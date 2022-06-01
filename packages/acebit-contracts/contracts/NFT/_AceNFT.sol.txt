// SPDX-License-Identifier: MIT
/// @title ACEBIT AceNFT contract

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AceNFT is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 currentTokenId = 1;
    string private _baseURIExtended;

    mapping(uint256 => string) _tokenURIs;

    event Minted(uint256 indexed tokenId, address receiver);

    event Burned(uint256 indexed tokenId);

    constructor() ERC721("Ace NFT", "ACENFT") {}

    function mint(address receiver)
        external
        onlyOwner
        nonReentrant
        returns (uint256 mintedTokenId)
    {
        mintedTokenId = currentTokenId;
        currentTokenId += 1;
        _mint(receiver, mintedTokenId);
        emit Minted(mintedTokenId, receiver);
    }

    function burn(uint256 tokenId) external onlyOwner nonReentrant {
        _burn(tokenId);
        emit Burned(tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    // Sets base URI for all tokens, only able to be called by contract owner
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIExtended = baseURI_;
    }

    // function setCollectionName(string memory collectionName_)
    //     external
    //     onlyOwner
    // {
    //     collectionName = collectionName_;
    // }

    function setTokenURI(uint256 tokenId, string memory tokenURI_)
        external
        onlyOwner
    {
        _tokenURIs[tokenId] = tokenURI_;
    }

    function ifTokenExist(uint256 tokenId) public view virtual returns (bool) {
        return _exists(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        if (bytes(_tokenURI).length != 0) {
            return _tokenURI;
        }

        string memory base = _baseURI();
        require(bytes(base).length != 0, "baseURI not set");
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
}
