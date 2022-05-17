const { ethers } = require("hardhat");
const constants = require('../utils/constants');

const NETWORK = process.env.NETWORK.toLowerCase();

async function main() {

  if ("UserStorage" in constants[NETWORK] && constants[NETWORK]["UserStorage"] != ""){
    throw new Error("UserStorage deploy error: contract exists");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account: " + deployer.address);

  const UserStorage = await ethers.getContractFactory("UserStorage");

  // deploy contract using owner *545
  const userStorage = await UserStorage.deploy("0xDf05CE25B93A11D0a39439E6f6b4D7E3bB554543");

  console.log("UserStorage address: %s", userStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});