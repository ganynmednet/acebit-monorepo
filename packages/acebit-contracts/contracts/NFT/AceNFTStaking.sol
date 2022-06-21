// SPDX-License-Identifier: MIT
/// @title ACEBIT NFT Staking

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

// interface IERC1155Supply {
// TODO
// }

interface IERC155ACEBIT {
    function transferToken(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;
}

contract AceNFTStaking is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    string public NAME;

    IERC20 public ACEBIT;
    address public ACENFT;

    uint256 public REWARD_PERIOD;
    uint256 public REWARD_PER_PERIOD;

    uint256 public totalStaked;

    struct Staker {
        uint256[] tokenIds;
        uint256 totalRewards;
        uint256 rewardsWithdrawn;
        uint256 updatedAt;
    }
    mapping(address => Staker) private stakers;

    event NFTStaked(address indexed owner, uint256[] tokenIds_);
    event NFTUnstaked(address indexed owner, uint256[] tokenIds_);

    constructor(
        string memory name_,
        address aceBit_,
        address aceNFT_,
        uint256 period_,
        uint256 rewardPerPeriod_
    ) {
        require(
            bytes(name_).length > 0,
            "AceNFTStaking::constructor: Invalid Contract name"
        );
        require(
            aceBit_ != address(0),
            "AceNFTStaking::constructor: Invalid ACEBIT address"
        );
        require(
            aceNFT_ != address(0),
            "AceNFTStaking::constructor: Invalid AceBit NFT address"
        );
        require(period_ > 0, "AceNFTStaking::constructor: Invalid period");
        require(
            rewardPerPeriod_ > 0,
            "AceNFTStaking::constructor: Invalid RewardPerPeriod"
        );

        NAME = name_;
        ACEBIT = IERC20(aceBit_);
        ACENFT = aceNFT_;
        REWARD_PERIOD = period_;
        REWARD_PER_PERIOD = rewardPerPeriod_;
    }

    /**
     *  @dev stake ACEBIT tokens
     *  @param tokenIds_ NFT id
     */
    function stake(uint256[] memory tokenIds_) external {
        // TODO refactor to uint256[]
        // TODO require tokens exist?

        _stake(msg.sender, tokenIds_);
    }

    /**
     * @dev All the staking goes through this function
     * @dev Rewards to be given out is calculated
     * @param userAddress_ User address
     * @param tokenIds_ NFT id
     */
    function _stake(address userAddress_, uint256[] memory tokenIds_) internal {
        // TODO refactor to safeBatchTransferFrom

        // TODO refactor _updateRewards if needed
        _updateRewards(userAddress_);

        Staker storage staker = stakers[userAddress_];

        for (uint256 i = 0; i < tokenIds_.length; i++) {
            staker.tokenIds.push(tokenIds_[i]);
            totalStaked = totalStaked += 1;

            IERC721(ACENFT).safeTransferFrom(
                address(userAddress_),
                address(this),
                tokenIds_[i]
            );
        }

        emit NFTStaked(msg.sender, tokenIds_);
    }

    /**
     *  @dev unstake ACEBIT tokens
     *  @param tokenIds_ List of token Ids to Unstake
     */
    function unstake(uint256[] memory tokenIds_) external {
        require(
            tokenIds_.length > 0,
            "AceNFTStaking::unstake: Invalid unstaking Ids"
        );

        // require(
        //     IERC721(ACENFT).balanceOf(msg.sender) > 0,
        //     "AceNFTStaking::unstake: User doesn't have staked NFTs"
        // );

        _unstake(msg.sender, tokenIds_);
    }

    /**
     * @dev All the staking goes through this function
     * @dev Rewards to be given out is calculated
     * @param userAddress_ User address
     * @param tokenIds_ List of token Ids to Unstake
     */
    function _unstake(
        address userAddress_,
        uint256[] memory tokenIds_
    ) internal {
        _updateRewards(userAddress_);

        // TODO: remove TokenIds

        for (uint256 i = 0; i < tokenIds_.length; i++) {
            // for (uint256 x = 0; x < staker.tokenIds.length; x++) {
            //     if (staker.tokenIds[x] == tokenIds_[i]) {

            //         console.log("DELETED TOKEN ", staker.tokenIds[x] );
            //         delete staker.tokenIds[x];
            //     }
            // }
            totalStaked = totalStaked -= 1;

            IERC721(ACENFT).safeTransferFrom(
                address(this),
                address(userAddress_),
                tokenIds_[i]
            );
        }

        emit NFTUnstaked(userAddress_, tokenIds_);
    }

    // function _remove(uint256 index) returns (uint256[]) {
    //     if (index >= array.length) return;

    //     for (uint256 i = index; i < array.length - 1; i++) {
    //         array[i] = array[i + 1];
    //     }
    //     delete array[array.length - 1];
    //     array.length--;
    //     return array;
    // }

    /**
     *  @dev show accumulated rewards to date
     *  @return _totalRewards total user rewards to date
     */
    function userRewards() public view returns (uint256 _totalRewards) {
        Staker storage staker = stakers[msg.sender];

        // require(
        //     staker.tokenIds.length > 0,
        //     "Expected User Staked balance greater than 0"
        // );

        if (staker.tokenIds.length == 0) return 0;

        uint256 __totalRewards = staker.totalRewards +
            _calculateRewards(staker.updatedAt, staker.tokenIds.length);
        return __totalRewards - staker.rewardsWithdrawn;
    }

    /**
     *  @dev withdrwaw user rewards
     */
    function withdrawRewards() external {
        _updateRewards(msg.sender);

        Staker storage staker = stakers[msg.sender];
        uint256 _availableRewards = staker.totalRewards -
            staker.rewardsWithdrawn;

        require(
            _availableRewards > 0,
            "AceNFTStaking::withdrawRewards: There is no available rewards for the user"
        );

        staker.rewardsWithdrawn = staker.rewardsWithdrawn + _availableRewards;

        ACEBIT.safeTransfer(address(msg.sender), _availableRewards);
    }

    /**
     *  @dev show accumulated rewards to date
     * @param _user address of the user to update reward
     */
    function _updateRewards(address _user) internal {
        Staker storage staker = stakers[_user];

        // if (staker.balance == 0) return;

        // uint256 _reward = _calculateRewards(staker.updatedAt, staker.balance);
        // console.log(_reward);
        staker.totalRewards =
            staker.totalRewards +
            _calculateRewards(staker.updatedAt, staker.tokenIds.length);
        staker.updatedAt = block.timestamp;
    }

    /**
     *  @dev calculate rewards per hour per token holdings
     *  @param updatedAt_ the latest reward update timestamp
     *  @param tokenNumber_ number of stakedNFTs
     *  @return  _reward calculated reward
     */
    function _calculateRewards(uint256 updatedAt_, uint256 tokenNumber_)
        internal
        view
        returns (uint256 _reward)
    {
        // https://medium.com/coinmonks/math-in-solidity-part-4-compound-interest-512d9e13041b
        if (updatedAt_ == 0) return 0;

        uint256 _x = REWARD_PER_PERIOD.mul(
            block.timestamp.sub(updatedAt_).div(REWARD_PERIOD).mul(tokenNumber_)
        );
        // console.log("result: ", _x);
        // console.log(REWARD_PER_PERIOD);
        // console.log(updatedAt_);
        // console.log(block.timestamp);
        // console.log(balance_);
        // return 0;
        return _x;
    }

    /**
     *  @dev retrive user data (Admin)
     */
    function getUser(address user_)
        external
        view
        onlyOwner
        returns (Staker memory)
    {
        Staker storage staker = stakers[user_];
        return staker;
    }

    /**
     *  @dev migrate
     *  @dev https://github.com/TidalFinance/tidal-contracts/blob/main/contracts/Staking.sol
     */
    function migrate(address user_) external view onlyOwner {
        return;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
