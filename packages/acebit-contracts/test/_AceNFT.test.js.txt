const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("ACEBIT NFT TEST", function () {

    let aceNFT, deployer;
    const _tokenId = 1;
    const _nextTokenId = 1;

    beforeEach(async () => {
        [deployer] = await ethers.getSigners();
    });

    it('Should deploy Ace NFT contract', async () => {

        const AceNFT = await ethers.getContractFactory("AceNFT");
        aceNFT = await AceNFT.deploy();

    });

    it('Should mint 1 NFT', async () => {

        await aceNFT.mint(deployer.address); //minting works

        expect(await aceNFT.ifTokenExist(0)).to.eq(false);
        expect(await aceNFT.ifTokenExist(1)).to.eq(true);
        expect(await aceNFT.ifTokenExist(2)).to.eq(false);

        expect(await aceNFT.balanceOf(deployer.address)).to.eq(_tokenId);

    });

    // it("Should set the collection name", async () => {
    //     await aceNFT.setCollectionName("AceBit Ace Collection");
    //     expect(await aceNFT.collectionName()).to.eq("AceBit Ace Collection")
    // });

    it("Should set token URI", async () => {
        let tokenURI = "https://test.com/1";
        let baseURIOne = "https://baseone.com/"
        let baseURITwo = "https://basetwo.com/";

        await aceNFT.setBaseURI(baseURIOne);
        expect(await aceNFT.tokenURI(_tokenId)).to.eq(`${baseURIOne}1`);
        // console.log("baseone set");

        await aceNFT.setBaseURI(baseURITwo);
        expect(await aceNFT.tokenURI(_tokenId)).to.eq(`${baseURITwo}1`);
        // console.log("basetwo set");

        // mint next token
        aceNFT.mint(deployer.address);
        expect(await aceNFT.ifTokenExist(0)).to.eq(false);
        expect(await aceNFT.ifTokenExist(1)).to.eq(true);
        expect(await aceNFT.ifTokenExist(2)).to.eq(true);
        expect(await aceNFT.ifTokenExist(3)).to.eq(false);

        await aceNFT.setTokenURI(_nextTokenId, tokenURI);
        expect(await aceNFT.tokenURI(_nextTokenId)).to.eq(tokenURI)

        // console.log("tokenuri set");

        expect(await aceNFT.totalSupply()).to.eq(2)
    });


    it("Should burn NFT", async () => {
        await aceNFT.burn(2);
        expect(await aceNFT.ifTokenExist(2)).to.eq(false);
        expect(await aceNFT.totalSupply()).to.eq(1)
    });

});