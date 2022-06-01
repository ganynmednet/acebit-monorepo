// SPDX-License-Identifier: MIT
/// @title ACEBIT AceNFT contract

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";


contract AceNFT is ERC1155 {
    // uint256 public constant GOLD = 0;
    // uint256 public constant SILVER = 1;
    // uint256 public constant THORS_HAMMER = 2;
    // uint256 public constant SWORD = 3;
    // uint256 public constant SHIELD = 4;
    // some array of names

    address private _owner;

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    constructor(string memory uri_) public ERC1155(uri_) {
        _owner = msg.sender;
    }

    function mint() external onlyOwner {
        // check minting flow in README
        _mint(msg.sender, 0, 1, "");
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function setURI(string memory uri_) external onlyOwner {
        _setURI(uri_);
    }

    function setOwner(address newOwner_) external onlyOwner {
        _owner = newOwner_;
    }

    // cnsider separate batch minting
}
