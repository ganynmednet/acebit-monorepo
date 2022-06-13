const { expect } = require("chai");
const { ethers } = require("hardhat");

let aceBitStaking, deployer, dao, aceNFT, aceNFTStaking;
const _largeApproval = '100000000000000000000000000000000';

describe("ACE NFT STAKING TEST", function () {
    it("Shoud deploy AceBit NFT Staking", async function () {

        [deployer, dao, randomUser] = await ethers.getSigners()
        
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
        // expect(await aceBitStaking.name()).to.equal(_name);
        // expect(await aceNFTStaking.owner()).to.equal(deployer.address);

    });

    it("Shoud prepare befoe staking (mint, acebit tranfer, approvals)", async function () {

        // Approve WHAT?
        await acebit.approve(aceNFTStaking.address, _largeApproval);

        // approve Staking contract (operator) to trasnfer user's tokens
        await aceNFT.setApprovalForAll(aceNFTStaking.address, true);
        expect(await aceNFT.isApprovedForAll(deployer.address, aceNFTStaking.address)).to.equal(true);

        // Transfer AceBit tokens to Staking contract
        await acebit.transfer(aceNFTStaking.address, "1000000000000000000000");

        // mint NFT
        await aceNFT.mint();
        expect(await aceNFT.balanceOf(deployer.address, "0")).to.equal("1");
        // expect(await aceNFT.exists("0")).to.equal("20000000000000000000000000");

    });



    it("Shoud Stake ACEBIT NFT", async function () {
        await aceNFTStaking.stake("0");

        var _user = await aceNFTStaking.getUser(deployer.address);
        console.log(_user);
        expect(_user.tokenIds[0]).to.equal("0");
        expect(_user.totalRewards).to.equal("0");
        // await expect(aceNFTStaking.stake("0")).to.be.revertedWith("AceNFTStaking::stake: invalid tokenId");

        // stake second NFT
    });


    it("Shoud claim Staking Reward ", async function () {



    });


    it("Shoud test Fronted fucntions", async function () {



    });


    it("Shoud Unstake ACEBIT ", async function () {


    });

});
