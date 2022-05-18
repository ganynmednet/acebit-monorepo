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
    acebit = await ACEBIT.deploy(dao.address);
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
      userStorage.address,
      "1000000000000000000000"
    );
    console.log("Presale contract address: %s", presale.address);

    // set presale $1500 maxCap
    expect(await presale.maxCap()).to.equal("1000000000000000000000");
    presale.setMaxCap("1500000000000000000000");
    expect(await presale.maxCap()).to.equal("1500000000000000000000");
    
    
    
    // transfer aACEBIT ownership to Presale contract
    await aAcebit.transferOwnership(presale.address);

    // check the initial ACEBIT DAO balance
    expect(await acebit.balanceOf(dao.address)).to.equal("400000000000000000000000000");
    
    // transfer 20m ACEBIT from DAO to Presale
    await acebit.connect(dao).approve(deployer.address, _largeApproval);
    await acebit.transferFrom(dao.address, presale.address, "20000000000000000000000000");
    
    // check DAO's and Presale's ACEBIT balances
    expect(await acebit.balanceOf(presale.address)).to.equal("20000000000000000000000000");
    expect(await acebit.balanceOf(dao.address)).to.equal("380000000000000000000000000");

    // allow Presale to transfer from aACEBIT from user
    await aAcebit.approve(presale.address, _largeApproval);

  });

  it("Should start Presale and deposit funds", async function () {

    // start presale
    await presale.start();

    // Approve the presale contract to spend DAI
    await dai.approve(presale.address, _largeApproval);

    // Deposit tests
    await expect(presale.deposit(_deposit499)).to.be.revertedWith("new amount below the user limit");
    await expect(presale.deposit(_deposit1501)).to.be.revertedWith("new amount above the user limit");

    await presale.deposit(_deposit1000);

    // check individual allocation and totalDaiRaised
    expect(await presale.getUserClaimableAllocation(deployer.address)).to.equal("1000000000000000000000");
    expect(await presale.totalDAIRaised()).to.equal("1000000000000000000000");

    // check DAI balance of the DAO contract
    expect(await dai.balanceOf(dao.address)).to.equal("1000000000000000000000");

    // check user aACEBIT balance
    const aBalance = await aAcebit.balanceOf(deployer.address);
    expect(aBalance.toString()).to.equal("50000000000000000000"); // 50
    // check user aCEBIT balance in the {user} recrd
    expect(await presale.getUserAceBitDebt(deployer.address)).to.equal("50000000000000000000"); // 50

    // check user remaining allocation to maxCap
    expect(await presale.getUserRemainingAllocation(deployer.address)).to.equal("500000000000000000000");

    // withdraw before claim unlock
    await expect(presale.claimAceBit()).to.be.revertedWith("ACEBIT is not yet claimable");

  });

  it('Should not allow to deposit after the presale end', async function() {

    // stop presale & unlock claim
    await presale.end();
    await presale.unlockAceBitClaim();
    expect(presale.deposit(_deposit1000)).to.be.revertedWith('Sale has ended');
    
  });

  it('Should allow to claim', async function() {

    // check if the user ACEBIT equal to zero
    expect(await acebit.balanceOf(deployer.address)).to.equal("0");

    // expect(presale.claimAceBit("51000000000000000000")).to.be.revertedWith('Claimable amount exceeds the user allocation');

    await presale.claimAceBit();

    // check if user has claimed everything in {user} record
    expect(await presale.getUserAceBitDebt(deployer.address)).to.equal("0"); 
    // check if user has claimed everything in aAcebit contract
    expect(await aAcebit.balanceOf(deployer.address)).to.equal("0");

    // check user fincal Acebit balance
    expect(await acebit.balanceOf(deployer.address)).to.equal("50000000000000000000");

    expect(presale.claimAceBit("50000000000000000000")).to.be.revertedWith('User has already claimed ACEBIT');
    
  });

  //   it("Should withdraw DAI from presale to DAO", async function () {

  //     await presale.adminWithdraw(dao.address, "1000000000000000000000")
  //     expect(await acebit.balanceOf(dao.address)).to.equal("1000000000000000000000");
  //     expect(await acebit.balanceOf(presale.address)).to.equal("0");

  // });


});