const { expect } = require("chai");
const { ethers } = require("hardhat");
// var Web3 = require('web3')
// import Web3 from 'web3';

// const web3 = new Web3(provider); 

// const toBytes = (string) => {
//   //https://ethereum.stackexchange.com/questions/23058/how-to-convert-string-to-bytes32-in-web3js
//   // https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#asciitohex
//   return Web3.utils.asciiToHex(string);
// };


describe("UserStorage", function () {
  it("Shoud deploy UserStorage and test it", async function () {

    [deployer, newOwner, userInstrance] = await ethers.getSigners()

    const user = {
      userAddress: userInstrance.address,
      userName: "Name",
      discordId: "DiscordId",
      userEmail: "user@email.com",
      reason: "Presale",
      whitelisted: true,
      created: new Date().getTime()
    }
    // console.log(user)

    const UserStorage = await ethers.getContractFactory("UserStorage");
    const userStorage = await UserStorage.deploy(deployer.address);
    await userStorage.deployed();


    // check owner/deployer functions
    expect(await userStorage.owner()).to.equal(deployer.address);
    expect(await userStorage.getDeployer()).to.equal(deployer.address);
    await userStorage.setOwner(newOwner.address)
    expect(await userStorage.owner()).to.equal(newOwner.address);

    // check initial user counts
    expect(await userStorage.getActiveUsers()).to.equal(0);
    expect(await userStorage.getDeletedUsers()).to.equal(0);

    // add user
    await userStorage.addUser(
      user.userAddress,
      user.userName,
      user.discordId,
      user.userEmail,
      user.reason,
      user.whitelisted,
      user.created
    )
    expect(await userStorage.getActiveUsers()).to.equal(1);
    expect(await userStorage.getDeletedUsers()).to.equal(0);

    expect(await userStorage.isUserWhitelisted(user.userAddress)).to.equal(true);
    expect(await userStorage.isUser(user.userAddress)).to.equal(true);
    expect(await userStorage.isUser(deployer.address)).to.equal(false);

    // update user Name
    await userStorage.updateUserName(
      user.userAddress,
      user.userName + "_updated",
      "test update",
      new Date().getTime()
    )

    // update user DiscordId
    await userStorage.updateDiscordId(
      user.userAddress,
      user.discordId + "_updated",
      "test update",
      new Date().getTime()
    )

    // update user Email
    await userStorage.updateUserEmail(
      user.userAddress,
      user.userEmail + "_updated",
      "test update",
      new Date().getTime()
    )


    await userStorage.deleteUser(
      user.userAddress,
      "test user deleted",
      new Date().getTime()
    )

    expect(await userStorage.getActiveUsers()).to.equal(0);
    expect(await userStorage.getDeletedUsers()).to.equal(1);

    const _res = await userStorage.getUser(user.userAddress)

    // console.log(_res);
    expect(_res.history.length).to.equal(5);

  
  });
});
