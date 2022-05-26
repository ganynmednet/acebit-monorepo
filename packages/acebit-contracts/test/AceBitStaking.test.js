const { expect } = require("chai");
const { ethers } = require("hardhat");

let aceBitStaking, deployer, dao;

describe("ACEBIT STAKING TEST", function () {
    it("Shoud deploy AceBit Staking", async function () {

        [deployer, dao] = await ethers.getSigners()
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
        // expect(await aceBitStaking.name()).to.equal(_name);
        // expect(await aceBitStaking.tokenAddress()).to.equal(acebit.address);

        // check aceBit balances contract & staker
    });

    it("Shoud Stake ACEBIT", async function () {

        // stake 1000 and then 1000 again + perform all the required checks

        // first stake of 1000
        await aceBitStaking.stake("1000000000000000000000");
        var _user = await aceBitStaking.getUser(deployer.address);
        // console.log(_user);
        expect(_user.balance).to.equal("1000000000000000000000");
        expect(_user.totalRewards).to.equal("0");
        expect( await acebit.balanceOf(aceBitStaking.address)).to.equal("1000000000000000000000")
        expect( await acebit.balanceOf(deployer.address)).to.equal("399999000000000000000000000")

        // second stake of 1000
        await aceBitStaking.stake("1000000000000000000000");
        _user = await aceBitStaking.getUser(deployer.address);
        // console.log(_user);
        expect(_user.balance).to.equal("2000000000000000000000");
        expect(_user.totalRewards).to.equal("5000000000000000000");
        expect( await acebit.balanceOf(aceBitStaking.address)).to.equal("2000000000000000000000")
        expect( await acebit.balanceOf(deployer.address)).to.equal("399998000000000000000000000")


    });


    it("Shoud claim Staking Reward ", async function () {

        // cliam reward once + checks
        // claim reward twice + checks

    });


    it("Shoud test Fronted fucntions", async function () {

        // view user rewards
        // withdraw rewards

    });

    it("Shoud withdraw user rewards", async function () {

        // withdraw twice

    });


    it("Shoud Unstake ACEBIT ", async function () {

        // unstake
        // await aceBitStaking.stake("1000000000000000000000");
        // console.log(await aceBitStaking.getUser(deployer.address));

        // check everything

    });

});
