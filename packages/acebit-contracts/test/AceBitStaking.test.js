const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("UserStorage", function () {
    it("Shoud deploy UserStorage and test it", async function () {

        [deployer, staker] = await ethers.getSigners()
        const _tokenAddress = "0x72727aA1Fa95660e7c67643eeF568891c3F936Fe";
        const _name = "AceBitStaking";

        // Staking contract deploy
        const AceBitStaking = await ethers.getContractFactory(_name);
        const aceBitStaking = await AceBitStaking.deploy(_name, _tokenAddress);
        await aceBitStaking.deployed();

        // After-deploy checks
        expect(await aceBitStaking.owner()).to.equal(deployer.address);
        expect(await aceBitStaking.name()).to.equal(_name);
        expect(await aceBitStaking.tokenAddress()).to.equal(_tokenAddress);

    });
});
