const { expect } = require("chai");
const { ethers } = require("hardhat");

let aceBitStaking, deployer, dao;

describe("ACEBIT STAKING TEST", function () {
    it("Shoud deploy AceBit Staking", async function () {

        [deployer, dao, randomUser] = await ethers.getSigners()
        const _largeApproval = '100000000000000000000000000000000';
        const _name = "AceBitStaking";
        const _period = "1"
        const _rewardPerPeriod = "5000000000000000" // 1e15 or 0.005% per hour => 0.136% per day => ~ 50% year

        // Deploy ACEBIT contract
        ACEBIT = await ethers.getContractFactory("AceBitERC20");
        acebit = await ACEBIT.deploy(deployer.address);
        console.log("AceBitERC20 address: %s", acebit.address);

        // Staking contract deploy
        const AceBitStaking = await ethers.getContractFactory(_name);
        aceBitStaking = await AceBitStaking.deploy(
            _name,
            acebit.address,
            _period,
            _rewardPerPeriod

        );
        await aceBitStaking.deployed();

        await acebit.approve(aceBitStaking.address, _largeApproval);

        // After-deploy checks
        expect(await aceBitStaking.owner()).to.equal(deployer.address);
        await acebit.transfer(aceBitStaking.address, "1000000000000000000000");
        // expect(await aceBitStaking.name()).to.equal(_name);
        // expect(await aceBitStaking.tokenAddress()).to.equal(acebit.address);

        // check aceBit balances contract & staker
    });

    it("Shoud Stake ACEBIT", async function () {

        // stake 1000 and then 1000 again + perform all the required checks

        // check basic staking validation
        await expect(aceBitStaking.stake("0")).to.be.revertedWith("Expected Staking amount greater than 0");
        await expect(aceBitStaking.stake("3999980000000000000000000000000000000")).to.be.revertedWith("Invalid user ACEBIT User balance");

        // first stake of 1000
        await aceBitStaking.stake("1000000000000000000000");
        var _user = await aceBitStaking.getUser(deployer.address);
        // console.log(_user);
        expect(_user.balance).to.equal("1000000000000000000000");
        expect(_user.totalRewards).to.equal("0");
        expect(await acebit.balanceOf(aceBitStaking.address)).to.equal("2000000000000000000000")
        expect(await acebit.balanceOf(deployer.address)).to.equal("399998000000000000000000000")

        // second stake of 1000
        await aceBitStaking.stake("1000000000000000000000");
        _user = await aceBitStaking.getUser(deployer.address);
        // console.log(_user);
        expect(_user.balance).to.equal("2000000000000000000000");
        expect(_user.totalRewards).to.equal("5000000000000000000");
        expect(await acebit.balanceOf(aceBitStaking.address)).to.equal("3000000000000000000000")
        expect(await acebit.balanceOf(deployer.address)).to.equal("399997000000000000000000000")


    });


    it("Shoud claim Staking Reward ", async function () {
        
        await expect(aceBitStaking.connect(randomUser).withdrawRewards()).to.be.revertedWith("There is no available rewards for the user");

        await aceBitStaking.withdrawRewards();

        _user = await aceBitStaking.getUser(deployer.address);
        // console.log(_user);
        expect(await aceBitStaking.userRewards()).to.equal("0");
        expect(_user.totalRewards).to.equal("25000000000000000000");
        expect(await acebit.balanceOf(deployer.address)).to.equal("399997025000000000000000000")
        expect(await acebit.balanceOf(aceBitStaking.address)).to.equal("2975000000000000000000")

        // cliam reward once + checks
        // claim reward twice + checks

    });


    it("Shoud test Fronted fucntions", async function () {

        await expect(aceBitStaking.connect(randomUser).userRewards()).to.be.revertedWith("Expected User Staked balance regater than 0");

        var _userRewards = await aceBitStaking.userRewards();
        expect(_userRewards).to.equal("0");

    });


    it("Shoud Unstake ACEBIT ", async function () {

        // check basic staking validation
        await expect(aceBitStaking.unstake("0")).to.be.revertedWith("Expected Unstaking amount greater than 0");
        await expect(aceBitStaking.unstake("3999980000000000000000000000000000000")).to.be.revertedWith("Expected amount less or equal user balance");

        // first unstake of 1000
        await aceBitStaking.unstake("1000000000000000000000");
        _user = await aceBitStaking.getUser(deployer.address);
        // console.log(_user);
        expect(_user.balance).to.equal("1000000000000000000000");
        expect(_user.totalRewards).to.equal("55000000000000000000");
        expect(await acebit.balanceOf(aceBitStaking.address)).to.equal("1975000000000000000000");
        expect(await acebit.balanceOf(deployer.address)).to.equal("399998025000000000000000000")

        // second unstake of 1000
        await expect(aceBitStaking.unstake("1000000000000000000001")).to.be.revertedWith("Expected amount less or equal user balance");
        await aceBitStaking.unstake("1000000000000000000000");
        _user = await aceBitStaking.getUser(deployer.address);
        // console.log(_user);
        expect(_user.balance).to.equal("0");
        expect(_user.totalRewards).to.equal("65000000000000000000");
        expect(await acebit.balanceOf(aceBitStaking.address)).to.equal("975000000000000000000");
        expect(await acebit.balanceOf(deployer.address)).to.equal("399999025000000000000000000")
        // check everything

    });

});
