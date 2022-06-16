const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("ACEBIT NFT TEST", function () {

    let aceNFT, deployer;
    const _URI = "ipfs://address/metadata/"
    const _newURI = "ipfs://address/metadata/"

    beforeEach(async () => {
        [deployer] = await ethers.getSigners();
    });

    it('Should deploy Ace NFT contract', async () => {

        const AceNFT = await ethers.getContractFactory("AceNFT");
        aceNFT = await AceNFT.deploy("AceNFT");

    });

    it('Should set NFT URI', async () => {
        // console.log(await aceNFT.uri(0))
        expect(await aceNFT.getURI()).to.eq("");
        
        await aceNFT.setURI(_newURI);
        expect(await aceNFT.getURI()).to.eq(_newURI);
    });

    it('Should change owner', async () => {

        await aceNFT.transferOwnership(deployer.address);
        expect(await aceNFT.owner()).to.eq(deployer.address);

    });


    it('Should mint NFT', async () => {
        // think about minting logic

        await aceNFT.mint(deployer.address, ["2"]);
    });

});