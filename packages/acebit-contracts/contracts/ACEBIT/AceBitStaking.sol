// SPDX-License-Identifier: MIT
/// @title ACEBIT Staking

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

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

    uint256 public REWARD_PERIOD;
    uint256 public REWARD_PER_PERIOD;

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

    constructor(
        string memory name_,
        address acebit_,
        uint256 period_,
        uint256 rewardPerPeriod_
    ) {
        require(bytes(name_).length > 0, "Invalid Contract name");
        require(acebit_ != address(0), "Invalid ACEBIT address");
        require(period_ > 0, "Invalid period");
        require(rewardPerPeriod_ > 0, "Invalid RewardPerPeriod");

        NAME = name_;
        ACEBIT = IERC20(acebit_);
        REWARD_PERIOD = period_;
        REWARD_PER_PERIOD = rewardPerPeriod_;
    }

    /**
     *  @dev stake ACEBIT tokens
     *  @param amount_ staking amount
     */
    function stake(uint256 amount_) external {
        require(amount_ > 0, "Expected Staking amount greater than 0");
        require(
            ACEBIT.balanceOf(msg.sender) > amount_,
            "Invalid user ACEBIT User balance"
        );

        _updateRewards(msg.sender);

        Staker storage staker = stakers[msg.sender];
        staker.balance = staker.balance.add(amount_);
        totalStaked = totalStaked.add(amount_);

        ACEBIT.safeTransferFrom(address(msg.sender), address(this), amount_);

        emit Staked(msg.sender, amount_);
    }

    /**
     *  @dev unstake ACEBIT tokens
     *  @param amount_ unstaking amount
     */
    function unstake(uint256 amount_) external {
        require(amount_ > 0, "Expected Unstaking amount greater than 0");

        Staker storage staker = stakers[msg.sender];

        require(
            staker.balance >= amount_,
            "Expected amount less or equal user balance"
        );

        _updateRewards(msg.sender);

        staker.balance = staker.balance.sub(amount_);
        totalStaked = totalStaked.sub(amount_);

        ACEBIT.safeTransfer(address(msg.sender), amount_);

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
     * @param _user address of the user to update reward
     */
    function _updateRewards(address _user) internal {
        Staker storage staker = stakers[_user];

        // uint256 _reward = _calculateRewards(staker.updatedAt, staker.balance);
        // console.log(_reward);
        staker.totalRewards =
            staker.totalRewards +
            _calculateRewards(staker.updatedAt, staker.balance);
        staker.updatedAt = block.timestamp;
    }

    /**
     *  @dev calculate rewards per hour per token holdings
     *  @param updatedAt_ the latest reward update timestamp
     *  @param balance_ current user balance to be used for the reward calculation
     *  @return  _reward calculated reward
     */
    function _calculateRewards(uint256 updatedAt_, uint256 balance_)
        internal
        returns (uint256 _reward)
    {
        // https://medium.com/coinmonks/math-in-solidity-part-4-compound-interest-512d9e13041b
        if (updatedAt_ == 0) return 0;

        uint256 _x = REWARD_PER_PERIOD.mul(
            block.timestamp.sub(updatedAt_).div(REWARD_PERIOD).mul(
                balance_.div(1e18)
            )
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
