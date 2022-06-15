const { expect } = require("chai");
const { ethers } = require("hardhat");


let aceBitStaking, deployer, dao, aceNFT, aceNFTStaking, aceNFTFactory, dai;
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
        dai = await DAI.deploy( 0 );
        console.log( "DAI: %s", dai.address );

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
        await aceNFT.setOwner(aceNFTFactory.address);
        
        // // mint NFT
        // await aceNFT.mint();
        // expect(await aceNFT.balanceOf(deployer.address, "0")).to.equal("1");
        // // expect(await aceNFT.exists("0")).to.equal("20000000000000000000000000");

    });

    it("Shoud mint NFTs to deployer address", async function () {

        await aceNFTFactory.mint("2");

        // check if NFT is has been minted
        var _buyer = await aceNFTFactory.getBuyer(deployer.address);
        expect(_buyer.tokendIds[0]).to.equal(1);

        // check if coin has been transfered to dao
        expect(await dai.balanceOf(dao.address)).to.equal("200000000000000000");

        // console.log(await dai.balanceOf(dao.address));

        await expect(aceNFTFactory.mint("5")).to.be.revertedWith("AceNFTFactory::mint: Mintable amount exceded. You can mint up to 5 Aces");

        await aceNFTFactory.togglePause();
        await expect(aceNFTFactory.mint("2")).to.be.revertedWith("AceNFTMint::mint: The mint is innactive");
        await aceNFTFactory.togglePause();

    });    

    it("Shoud Stake ACEBIT NFT", async function () {
        // await aceNFTStaking.stake("0");

        // var _user = await aceNFTStaking.getUser(deployer.address);
        // console.log(_user);
        // expect(_user.tokenIds[0]).to.equal("0");
        // expect(_user.totalRewards).to.equal("0");
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
