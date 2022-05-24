const { expect } = require("chai");
const { ethers } = require("hardhat");

let aceBitStaking, deployer, dao;

describe("ACEBIT STAKING TEST", function () {
    it("Shoud deploy AceBit Staking", async function () {

        [deployer, dao] = await ethers.getSigners()
        const _largeApproval = '100000000000000000000000000000000';
        const _name = "AceBitStaking";

        // Deploy ACEBIT contract
        ACEBIT = await ethers.getContractFactory("AceBitERC20");
        acebit = await ACEBIT.deploy(deployer.address);
        console.log("AceBitERC20 address: %s", acebit.address);

        // Staking contract deploy
        const AceBitStaking = await ethers.getContractFactory(_name);
        aceBitStaking = await AceBitStaking.deploy(_name, acebit.address);
        await aceBitStaking.deployed();

        await acebit.approve(aceBitStaking.address, _largeApproval);

        // After-deploy checks
        expect(await aceBitStaking.owner()).to.equal(deployer.address);
        // expect(await aceBitStaking.name()).to.equal(_name);
        // expect(await aceBitStaking.tokenAddress()).to.equal(acebit.address);




        // check aceBit balances contract & staker
    });

    it("Shoud Stake ACEBIT", async function () {

        // stake twice and check rewards

        await aceBitStaking.stake("1000000000000000000000");
        console.log(await aceBitStaking.getUser(deployer.address));

    });


    it("Shoud Unstake ACEBIT ", async function () {

        // unstake twice and check rewards

        // await aceBitStaking.stake("1000000000000000000000");
        // console.log(await aceBitStaking.getUser(deployer.address));

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
