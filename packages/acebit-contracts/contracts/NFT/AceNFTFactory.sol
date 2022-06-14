// SPDX-License-Identifier: MIT
/// @title ACEBIT NFT Factory

pragma solidity ^0.8.4;

// https://etherscan.io/address/0x8575B2Dbbd7608A1629aDAA952abA74Bcc53d22A#code

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IACENFT {
    function mint(address address_, uint256 tokenId_) external;
}

contract AceNFTFactory is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bool public ACTIVE;

    address public DAO;
    address public ACENFT;
    address public COIN;

    uint256 public MAX_MINTABLE;
    uint256 public PRICE;
    uint256 public MAX_SUPPLY = 8888;

    struct Buyer {
        uint256[] tokendIds;
    }
    mapping(address => Buyer) private buyers;

    event Minted(address indexed owner, uint256 tokenId);
    event TogglePause(bool active);

    constructor(
        address aceNft_,
        address coin_,
        address dao_,
        uint256 maxMintable_,
        uint256 price_
    ) {
        require(coin_ != address(0), "AceNFTFactory::constructor: Invalid ACEBIT contract address");
        require(aceNft_ != address(0), "AceNFTFactory::constructor: Invalid AceBit NFT contract address");
        require(dao_ != address(0), "AceNFTFactory::constructor: Invalid DAO address");
        require(maxMintable_ > 0, "AceNFTFactory::constructor: Invalid Max Mintable");
        require(price_ > 0, "AceNFTFactory::constructor: Invalid Price");

        COIN = coin_;
        ACENFT = aceNft_;
        DAO = dao_;
        MAX_MINTABLE = maxMintable_;
        PRICE = price_;
        ACTIVE = false;
    }

    function mint(uint256 tokensToBuy_) external {
        require(ACTIVE, "AceNFTMint::mint: The mint is innactive.");

        Buyer storage buyer = buyers[msg.sender];
        // console.log(MAX_MINTABLE + tokensToBuy_);
        require(
            buyer.tokendIds.length + tokensToBuy_ <= MAX_MINTABLE,
            "AceNFTFactory::mint: Mintable amount exceded. You can mint up to 5 Aces."
        );

        _mint(msg.sender, buyer, tokensToBuy_);
    }

    function _mint(
        address buyerAddress_,
        Buyer storage buyer,
        uint256 tokensToBuy_
    ) private {
        // implement batch minting!

        _tokenIds.increment();
        uint256 _newTokenId = _tokenIds.current();

        require(_newTokenId <= MAX_SUPPLY, "AceNFTFactory::_mint: MAX_SUPPLY exceeded.");

        uint256 _amount = tokensToBuy_.mul(PRICE);

        buyer.tokendIds.push(_newTokenId);

        IERC20(COIN).safeTransferFrom(buyerAddress_, address(DAO), _amount);

        // IERC1155(ACENFT).safeTransferFrom(
        //     address(this),
        //     address(buyerAddress_),
        //     _newTokenId,
        //     1,
        //     "0x0"
        // );

        IACENFT(ACENFT).mint(buyerAddress_, _newTokenId);

        emit Minted(buyerAddress_, _newTokenId);
    }

    function setDAO(address dao_) external onlyOwner {
        require(dao_ != address(0), "AceNFTFactory::setDAO: Invalid DAO address");
        DAO = dao_;
    }

    function setCoin(address coin_) external onlyOwner {
        require(coin_ != address(0), "AceNFTFactory::setCoin: Invalid ACEBIT contract address");
        COIN = coin_;
    }

    function setAceNFT(address aceNFT_) external onlyOwner {
        require(aceNFT_ != address(0), "AceNFTFactory::setAceNFT: Invalid ACEBIT contract address");
        ACENFT = aceNFT_;
    }

    function setPrice(uint256 price_) external onlyOwner {
        PRICE = price_;
    }

    function setMaxMintable(uint256 maxMintable_) external onlyOwner {
        MAX_MINTABLE = maxMintable_;
    }

    function togglePause() external onlyOwner {
        bool _active = !ACTIVE;
        ACTIVE = !ACTIVE;

        emit TogglePause(_active);
    }

    function active() public view returns (bool active) {
        return ACTIVE;
    }

    /**
     *  @dev retrive user data (Admin)
     */
    function getBuyer(address user_)
        external
        view
        onlyOwner
        returns (Buyer memory)
    {
        Buyer storage buyer = buyers[user_];
        return buyer;
    }
}
