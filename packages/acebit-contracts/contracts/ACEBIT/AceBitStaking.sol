// SPDX-License-Identifier: MIT
/// @title ACEBIT Staking

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// https://github.com/HQ20/StakingToken/blob/master/contracts/StakingToken.sol
// https://github.com/second-state/simple-staking-smart-contract/blob/main/SimpleStaking.sol
// https://github.com/xdaichain/easy-staking-contracts/blob/master/contracts/EasyStaking.sol
// https://github.com/ibnzUK/Token-Staking-dApp
// https://github.com/DIGITALAX/staking/tree/main/contracts - not bad
// https://github.com/ZeframLou/playpen

// https://github.com/TidalFinance/tidal-contracts/blob/main/contracts/Staking.sol - flat
// https://github.com/gr3yc4t/ERC20-Staking-Machine

contract AceBitStaking is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    string public NAME;
    IERC20 public ACEBIT;

    uint256 public REWARD_PER_BLOCK_RATE;
    uint256 public totalStaked;

    struct Staker {
        uint256 balance;
        uint256 totalRewards;
        uint256 rewardsWithdrawn;
        uint256 updatedAt;
    }
    mapping(address => Staker) public stakers;

    event Staked(address indexed owner, uint256 amount);
    event Unstaked(address indexed owner, uint256 amount);

    constructor(string memory name_, address acebit_) {
        require(bytes(name_).length > 0, "Invalid Contract name");
        require(acebit_ != address(0), "Invalid ACEBIT address");

        NAME = name_;
        ACEBIT = IERC20(acebit_);
    }

    /**
     *  @dev stake ACEBIT
     */
    function stake(uint256 amount_) external {
        require(amount_ > 0, "Invalid amount");
        require(
            ACEBIT.balanceOf(msg.sender) > amount_,
            "Invalid user ACEBIT balance"
        );

        _updateRewards(msg.sender);

        Staker storage staker = stakers[msg.sender];
        staker.balance = staker.balance.add(amount_);
        totalStaked = totalStaked.add(amount_);

        ACEBIT.safeTransferFrom(address(msg.sender), address(this), amount_);

        emit Staked(msg.sender, amount_);
    }

    /**
     *  @dev unstake ACEBIT
     */
    function unstake(uint256 amount_) external {
        require(amount_ > 0, "Invalid amount");

        _updateRewards(msg.sender);

        Staker storage staker = stakers[msg.sender];
        staker.balance = staker.balance.sub(amount_);
        totalStaked = totalStaked.sub(amount_);

        emit Unstaked(msg.sender, amount_);
    }

    /**
     *  @dev show accumulated rewards to date
     */
    function userRewards() external view {
        // calculate rewards
        Staker storage staker = stakers[msg.sender];
        return;
    }

    /**
     *  @dev withdrwaw user rewards
     */
    function withdrawRewards(uint256 amount) external {
        // check ammount
        // transfer tokens

        return;
    }

    /**
     *  @dev show accumulated rewards to date
     */
    function _updateRewards(address _user) internal {
        Staker storage staker = stakers[_user];

        staker.totalRewards = staker.balance.mul(2);
        staker.updatedAt = block.timestamp;
    }

    /**
     *  @dev calculate rewards (math)
     */
    function _calculateRewards() internal {
        // calculate rewards
        return;
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
    function migrate(address user_)
        external
        view
        onlyOwner
    {
        return;
    }
}

// /**
//  *  @notice returns Staking Pool name
//  *  @param _amount: amount of token to withdraw
//  */

// /**
//  *  @dev returns Staking Pool name
//  *  @return _name The Staking pool name
//  */
// function name() public view returns (string memory) {
//     return _name;
// }

// /**
//  *  @dev returns Staking Pool name
//  *  @return _tokenAddress The staking token address
//  */
// function tokenAddress() public view returns (address) {
//     return _tokenAddress;
// }
