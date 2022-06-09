const { expect } = require("chai");
const { ethers } = require("hardhat");

let aceBitStaking, deployer, dao, aceNFT, aceNFTStaking;

describe("ACE NFT STAKING TEST", function () {
    it("Shoud deploy AceBit Staking", async function () {

        [deployer, dao, randomUser] = await ethers.getSigners()
        const _largeApproval = '100000000000000000000000000000000';
        const _name = "AceNFTStaking";
        const _period = "1"
        const _rewardPerPeriod = "5000000000000000" // 1e15 or 0.005% per hour => 0.136% per day => ~ 50% year
        const _URI = "ipfs://address/metadata/"


        // Deploy ACEBIT contract
        ACEBIT = await ethers.getContractFactory("AceBitERC20");
        acebit = await ACEBIT.deploy(deployer.address);
        console.log("AceBitERC20 address: %s", acebit.address);

        // Deploy Ace NFT contract
        const AceNFT = await ethers.getContractFactory("AceNFT");
        aceNFT = await AceNFT.deploy(_URI);
        console.log("AceBitNFT address: %s", aceNFT.address);

        // Staking contract deploy
        const AceNFTStaking = await ethers.getContractFactory("AceNFTStaking");
        aceNFTStaking = await AceNFTStaking.deploy(
            _name,
            acebit.address,
            aceNFT.address,
            _period,
            _rewardPerPeriod

        );
        await aceNFTStaking.deployed();

        await acebit.approve(aceNFTStaking.address, _largeApproval);

        // After-deploy checks
        expect(await aceNFTStaking.owner()).to.equal(deployer.address);
        await acebit.transfer(aceNFTStaking.address, "1000000000000000000000");
        // expect(await aceBitStaking.name()).to.equal(_name);
        // expect(await aceBitStaking.tokenAddress()).to.equal(acebit.address);

        // check aceBit balances contract & staker
    });

    it("Shoud Stake ACEBIT", async function () {



    });


    it("Shoud claim Staking Reward ", async function () {



    });


    it("Shoud test Fronted fucntions", async function () {



    });


    it("Shoud Unstake ACEBIT ", async function () {


    });

});
