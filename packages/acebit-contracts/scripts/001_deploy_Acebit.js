const { ethers } = require("hardhat");
const constants = require('../utils/constants');

const NETWORK = process.env.NETWORK.toLowerCase();

async function main() {

  if ("ACEBIT" in constants[NETWORK] && constants[NETWORK]["ACEBIT"] != ""){
    throw new Error("Whitelist deploy error: contract exists");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account: " + deployer.address);

  const AceBitERC20 = await ethers.getContractFactory("AceBitERC20");
  const aceBitERC20 = await AceBitERC20.deploy();
  console.log("AceBitERC20 address: %s", aceBitERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});