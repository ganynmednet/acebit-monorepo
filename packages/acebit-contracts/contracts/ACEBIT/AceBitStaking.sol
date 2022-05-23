// SPDX-License-Identifier: MIT
/// @title ACEBIT Staking

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

// https://github.com/HQ20/StakingToken/blob/master/contracts/StakingToken.sol
// https://github.com/second-state/simple-staking-smart-contract/blob/main/SimpleStaking.sol
// https://github.com/xdaichain/easy-staking-contracts/blob/master/contracts/EasyStaking.sol
// https://github.com/ibnzUK/Token-Staking-dApp
// https://github.com/DIGITALAX/staking/tree/main/contracts
// https://github.com/ZeframLou/playpen

// https://github.com/TidalFinance/tidal-contracts/blob/main/contracts/Staking.sol
// https://github.com/gr3yc4t/ERC20-Staking-Machine

contract AceBitStaking is Ownable {
    string private _name;
    address _tokenAddress;

    struct StakerInfo {
        uint256 amount;
        uint256 rewardWithdrawn;
    }
    mapping(address => StakerInfo) public stakers;

    constructor(string memory name_, address tokenAddress_) {
        require( bytes(name_).length > 0, "Invalid Contract name");
        require( tokenAddress_ != address(0), "Invalid Staking Token address");
        _name = name_;
        _tokenAddress = tokenAddress_;
    }

    /**
     *  @dev returns Staking Pool name
     *  @return _name The Staking pool name
     */
    function name() public view  returns (string memory) {
        return _name;
    }

    /**
     *  @dev returns Staking Pool name
     *  @return _tokenAddress The staking token address
     */
    function tokenAddress() public view returns (address) {
        return _tokenAddress;
    }
}


    // /**
    //  *  @notice returns Staking Pool name
    //  *  @param _amount: amount of token to withdraw
    //  */
