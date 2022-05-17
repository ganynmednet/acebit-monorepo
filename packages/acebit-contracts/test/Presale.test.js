const { expect } = require("chai");
const { ethers } = require("hardhat");

let 
  PreSale, presale,
  DAI,
  dai,
  ACEBIT, acebit,
  aACEBIT, aAcebit,

  _largeApproval = '100000000000000000000000000000000',
  //_largeApproval = (100000000000000 * 1e18).toString(),
  // _ROME = "0xDf05CE25B93A11D0a39439E6f6b4D7E3bB554543",  
  // _DAI,
  // _FRAX = "0xDf05CE25B93A11D0a39439E6f6b4D7E3bB554543",
  // _DAO = "0xDf05CE25B93A11D0a39439E6f6b4D7E3bB554543",
  // _WARCHEST = "0xDf05CE25B93A11D0a39439E6f6b4D7E3bB554543",

  //_DAIMint = "5000000" + + (1 * 1e18).toString();
  // _DAIMint = (5000000 * 10 * 1e18);
  _DAIMint = "5000000000000000000000000", // 000000000000000000
  _deposit1000 = "1000000000000000000000",
  _deposit499 = "499000000000000000000",
  _deposit1501 = "1501000000000000000000" 
  _withdraw10001 = "100100000000000000000"
  


describe("ACEBIT Presale test", function () {

  beforeEach(async () => {
    [deployer, dao] = await ethers.getSigners();    
   
  });

  it("Should deploy ACEBIT Presale, ACEBIT, and aACEBIT contracts", async function () {

    // Deploy mock DAI contract
    DAI = await ethers.getContractFactory('DAI');
    dai = await DAI.deploy( 0 );
    console.log( "DAI: %s", dai.address );

    // Mint DAI
    await dai.mint(deployer.address, _DAIMint);

    // Deploy ACEBIT contract
    ACEBIT = await ethers.getContractFactory("AceBitERC20");
    acebit = await ACEBIT.deploy();
    console.log("AceBitERC20 address: %s", acebit.address);

    // Deploy aACEBIT contract
    aACEBIT = await ethers.getContractFactory("AlphaAceBitERC20");
    aAcebit = await aACEBIT.deploy();
    console.log("AlphaAceBitERC20 address: %s", aAcebit.address);

    // Deploy UserStorage
    const UserStorage = await ethers.getContractFactory("UserStorage");
    const userStorage = await UserStorage.deploy(deployer.address);
    await userStorage.deployed();

    // AddUser to UserStorage
    const user = {
      userAddress: deployer.address,
      userName: "Name",
      discordId: "DiscordId",
      userEmail: "user@email.com",
      reason: "Presale",
      whitelisted: true,
      created: new Date().getTime()
    }
    await userStorage.addUser(
      user.userAddress,
      user.userName,
      user.discordId,
      user.userEmail,
      user.reason,
      user.whitelisted,
      user.created
    )
    expect(await userStorage.isUserWhitelisted(user.userAddress)).to.equal(true);

    // Deploy Presale contract
    PreSale = await ethers.getContractFactory("AceBitPresale");
    presale = await PreSale.deploy(
      acebit.address,
      aAcebit.address,
      dai.address,
      dao.address,
      userStorage.address
    );
    console.log("Presale contract address: %s", presale.address);
  });

  it("Should add/remove from waiting list", async function () {
    // aworld set presale contract
    await aworld.setPresale(presale.address);

    // add/remove to/from Whitelist
    await presale.addWhitelist(deployer.address);
    await presale.removeWhitelist(deployer.address);
    await presale.addWhitelist(deployer.address);
  });

  it("Should start Presale and deposit funds", async function () {

    // start presale
    await presale.start();

    // Approve the presale contract to spend DAI
    await dai.approve(presale.address, _largeApproval);

    // Deposit tests
    await expect(presale.deposit(_deposit499)).to.be.revertedWith("new amount below user limit");
    await expect(presale.deposit(_deposit1501)).to.be.revertedWith("new amount above user limit");

    await presale.deposit(_deposit1000);
    const aBalance = await aworld.balanceOf(deployer.address);
    expect(sWorldBalance.toString()).to.equal("50000000000");

    // withdraw before claim unlock
    await expect(presale.withdraw("50000000000")).to.be.revertedWith("ROME is not yet claimable");

  });

  it('Should not allow to deposit after the presale end', async function() {

    // stop presale & unlock claim
    await presale.end();
    await presale.claimUnlock();
    expect(presale.deposit(_deposit1000)).to.be.revertedWith('Sale has ended');
    
  });

  it('Should allow to widthdraw', async function() {

    // stop presale
    await presale.withdraw("51000000000");

    //await expect(presale.withdraw("50000000000")).to.be.revertedWith("ROME is not yet claimable");
    
  });


});