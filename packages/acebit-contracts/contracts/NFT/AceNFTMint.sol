// SPDX-License-Identifier: MIT
/// @title ACEBIT NFT Mint

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AceNFTMint is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    bool public ACTIVE;
    address public DAO;

    address public ACEBIT;
    address public ACEBIT_NFT;

    uint256 MAX_MINTABLE;
    uint256 public PRICE;

    event Minted(address indexed owner, uint256 tokenId);
    event TogglePause(bool active);

    constructor(
        address acebit_,
        address aceBitNft_,
        address dao_,
        uint256 maxMintable_,
        uint256 price_
    ) {
        require(acebit_ != address(0), "Invalid ACEBIT contract address");
        require(
            aceBitNft_ != address(0),
            "Invalid AceBit NFT contract address"
        );
        require(dao_ != address(0), "Invalid DAO address");
        require(maxMintable_ > 0, "Invalid Max Mintable");
        require(price_ > 0, "Invalid Price");

        ACEBIT = acebit_;
        ACEBIT_NFT = aceBitNft_;
        DAO = dao_;
        MAX_MINTABLE = maxMintable_;
        PRICE = price_;
    }

    function mint(uint256 toBuy_) external {
        require(
            toBuy_ <= MAX_MINTABLE,
            "AceNFTMint::mint: Amount exceded, you can mint up to 5 Aces."
        );

        _mint(msg.sender, toBuy_);
    }

    function _mint(address buyer_, uint256 toBuy_) private {
        // generate tokenIds => based on the tokens the contract has? base on the set range?
        // tranfser money
        // mint batch

        uint256 _tokenId = 0;

        uint256 _amount = toBuy_.mul(PRICE);

        IERC20(ACEBIT).safeTransferFrom(buyer_, address(DAO), _amount);

        IERC1155(ACEBIT_NFT).safeTransferFrom(
            address(this),
            address(buyer_),
            _tokenId,
            1,
            "0x0"
        );

        emit Minted(buyer_, _tokenId);
    }

    function setDAO(address dao_) external onlyOwner {
        require(dao_ != address(0), "Invalid DAO address");
        DAO = dao_;
    }

    function setACEBIT(address acebit_) external onlyOwner {
        require(acebit_ != address(0), "Invalid ACEBIT contract address");
        ACEBIT = acebit_;
    }

    function setAceBitNFT(address aceBitNFT_) external onlyOwner {
        require(aceBitNFT_ != address(0), "Invalid ACEBIT contract address");
        ACEBIT_NFT = aceBitNFT_;
    }

    function setPrice(uint256 price_) external onlyOwner {
        PRICE = price_.mul(1e18);
    }

    function setMaxMintable(uint256 maxMintable_) external onlyOwner {
        MAX_MINTABLE = maxMintable_;
    }

    function togglePause() external {
        bool _active = !ACTIVE;
        ACTIVE = !ACTIVE;

        emit TogglePause(_active);
    }
}
