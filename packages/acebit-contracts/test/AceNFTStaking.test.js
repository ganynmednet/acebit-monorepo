const { expect } = require("chai");
const { ethers } = require("hardhat");
// import { utils } from "ethers";
const { utils } = require("ethers");

let aceBitStaking, deployer, dao, aceNFT, aceNFTStaking, aceNFTFactory, dai, randomUser;
const _largeApproval = '100000000000000000000000000000000';

const _name = "AceNFTStaking";
const _period = "1"
const _rewardPerPeriod = "5000000000000000" // 1e15 or 0.005% per hour => 0.136% per day => ~ 50% year
const _URI = "ipfs://address/metadata/"

describe("ACE NFT STAKING TEST", function () {

    beforeEach(async () => {
        [deployer, dao, randomUser] = await ethers.getSigners();
    });


    it("Shoud deploy AceBit", async function () {

        // Deploy ACEBIT contract
        ACEBIT = await ethers.getContractFactory("AceBitERC20");
        acebit = await ACEBIT.deploy(deployer.address);
        console.log("AceBitERC20 address: %s", acebit.address);

    });

    it("Shoud deploy AceNFT ", async function () {

        // Deploy Ace NFT contract
        const AceNFT = await ethers.getContractFactory("AceNFT");
        aceNFT = await AceNFT.deploy(_URI);
        console.log("AceBitNFT address: %s", aceNFT.address);

    });

    it("Shoud deploy DAI mock ", async function () {

        // Deploy mock DAI contract
        DAI = await ethers.getContractFactory('DAI');
        dai = await DAI.deploy(0);
        console.log("DAI: %s", dai.address);

        // Mint DAI
        await dai.mint(deployer.address, "1000000000000000000000");

    });

    it("Shoud deploy AceNFTFactory", async function () {

        // Deploy AceNFTFactory contract

        const AceNFTFactory = await ethers.getContractFactory("AceNFTFactory");
        aceNFTFactory = await AceNFTFactory.deploy(
            aceNFT.address,
            dai.address,
            dao.address,
            "2",
            "100",
            "Bla Bla"
        );
        console.log("AceNFTFactory address: %s", aceNFTFactory.address);

        // toggle contratc pause
        expect(await aceNFTFactory.ACTIVE()).to.equal(false);
        await aceNFTFactory.togglePause();
        expect(await aceNFTFactory.ACTIVE()).to.equal(true)

        // check admin set functions
        await aceNFTFactory.setMaxMintable(5);
        await aceNFTFactory.setPrice("100000000000000000");
        await aceNFTFactory.setAceNFT(aceNFT.address);
        await aceNFTFactory.setDAO(dao.address);
        await aceNFTFactory.setCoin(dai.address);
        await aceNFTFactory.setCurrentMint("Ace NFT Private Sale");

        // FACTORY TESTING ? WHAT ELSE?
    });



    it("Shoud deploy AceNFTStaking cont", async function () {

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

        // STANKING BASI TESTING

    });


    it("Shoud make preporations befoe staking (mint, acebit tranfer, approvals)", async function () {

        // Approve WHAT?
        await acebit.approve(aceNFTStaking.address, _largeApproval);
        await acebit.approve(aceNFTFactory.address, _largeApproval);

        await dai.approve(aceNFTFactory.address, _largeApproval);

        // approve Staking contract (operator) to trasnfer user's tokens
        await aceNFT.setApprovalForAll(aceNFTFactory.address, true);
        await aceNFT.setApprovalForAll(aceNFTStaking.address, true);
        expect(await aceNFT.isApprovedForAll(deployer.address, aceNFTFactory.address)).to.equal(true);
        expect(await aceNFT.isApprovedForAll(deployer.address, aceNFTStaking.address)).to.equal(true)

        // Transfer AceBit tokens to Staking contract
        await acebit.transfer(aceNFTStaking.address, "1000000000000000000000");

        // set NFT contract owner to allow minting
        await aceNFT.transferOwnership(aceNFTFactory.address);

        // // mint NFT
        // await aceNFT.mint();
        // expect(await aceNFT.balanceOf(deployer.address, "0")).to.equal("1");
        // // expect(await aceNFT.exists("0")).to.equal("20000000000000000000000000");

    });

    it("Shoud mint NFTs to deployer address", async function () {

        await aceNFTFactory.mint("1");

        // check if NFT is has been minted
        var _buyer = await aceNFTFactory.getBuyer(deployer.address);
        expect(_buyer.tokendIds[0]).to.equal(1);

        // check if coin has been transfered to dao
        expect(await dai.balanceOf(dao.address)).to.equal("100000000000000000");

        // console.log(await dai.balanceOf(dao.address));

        await expect(aceNFTFactory.mint("5")).to.be.revertedWith("AceNFTFactory::mint: Mintable amount exceded. You can mint up to 5 Aces");

        await aceNFTFactory.togglePause();
        await expect(aceNFTFactory.mint("3")).to.be.revertedWith("AceNFTMint::mint: The mint is innactive");
        await aceNFTFactory.togglePause();

        await aceNFTFactory.mint("2");
        expect(await aceNFT.balanceOf(deployer.address)).to.equal("3");
        expect(await aceNFT.totalSupply()).to.equal("3");
        expect(await dai.balanceOf(dao.address)).to.equal("300000000000000000");
        expect(await dai.balanceOf(deployer.address)).to.equal("999700000000000000000");

    });

    it("Shoud Stake ACEBIT NFT", async function () {

        // Single Staking
        let _tokenIdToStakeSINGLE = await aceNFT.tokenOfOwnerByIndex(deployer.address, 0)
        await aceNFTStaking.stake([_tokenIdToStakeSINGLE]);

        // Multiple Staking

        // for (let i = 1; i <  _userTokens ; i++) {
        //     console.log(i)
        //     let _id = await aceNFT.tokenOfOwnerByIndex(deployer.address, i)
        //     console.log(_id)
        //     _tokenIdsToStakeMULTIPLE.push(_id)
        // }
        // console.log(_tokenIdsToStakeMULTIPLE)
        await aceNFTStaking.stake([2, 3]);
        expect(await aceNFT.balanceOf(deployer.address)).to.equal("0");
        expect(await aceNFT.balanceOf(aceNFTStaking.address)).to.equal("3");
        expect(await aceNFT.totalSupply()).to.equal("3");


        var _user = await aceNFTStaking.getUser(deployer.address);
        expect(await _user.tokenIds.length).to.equal(3);
        console.log(_user);
        // expect(_user.tokenIds[0]).to.equal("0");
        // expect(_user.totalRewards).to.equal("0");
        // await expect(aceNFTStaking.stake("0")).to.be.revertedWith("AceNFTStaking::stake: invalid tokenId");

        // stake second NFT


    });


    it("Shoud claim Staking Reward ", async function () {

        await expect(aceNFTStaking.connect(randomUser).withdrawRewards()).to.be.revertedWith("AceNFTStaking::withdrawRewards: There is no available rewards for the user");

        await aceNFTStaking.withdrawRewards();

        _user = await aceNFTStaking.getUser(deployer.address);
        console.log(_user)
        expect(_user.totalRewards).to.equal("35000000000000000");
        expect(_user.rewardsWithdrawn).to.equal("35000000000000000");

        expect(await acebit.balanceOf(deployer.address)).to.equal("399999000035000000000000000");
        expect(await acebit.balanceOf(aceNFTStaking.address)).to.equal("999965000000000000000");

    });


    it("Shoud test Fronted fucntions", async function () {

        // await expect(aceNFTStaking.connect(randomUser).userRewards()).to.be.revertedWith("Expected User Staked balance regater than 0");

        var _userRewards = await aceNFTStaking.userRewards();
        console.log(_userRewards)
        expect(_userRewards).to.equal("0");


    });


    it("Shoud Unstake ACEBIT ", async function () {

        await expect(aceNFTStaking.unstake([])).to.be.revertedWith("AceNFTStaking::unstake: Invalid unstaking Ids");

        // Unstake 1
        await aceNFTStaking.unstake([1]);
        expect(await aceNFT.balanceOf(deployer.address)).to.equal("1");
        expect(await aceNFT.balanceOf(aceNFTStaking.address)).to.equal("2");
        expect(await aceNFT.totalSupply()).to.equal("3");

        _user = await aceNFTStaking.getUser(deployer.address);
        console.log(_user)

        // Unstake 2,3 
        await aceNFTStaking.unstake([2, 3]);
        expect(await aceNFT.balanceOf(deployer.address)).to.equal("3");
        expect(await aceNFT.balanceOf(aceNFTStaking.address)).to.equal("0");
        expect(await aceNFT.totalSupply()).to.equal("3");
    });

});
