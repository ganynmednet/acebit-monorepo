const { ethers } = require("hardhat");
const constants = require('../../utils/constants');

const NETWORK = process.env.NETWORK.toLowerCase();

async function main() {

  if ("DAI" in constants[NETWORK] && constants[NETWORK]["DAI"] != ""){
    throw new Error("DAI deploy error: contract exists");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account: " + deployer.address);

  const DAI = await ethers.getContractFactory("DAI");
  const dai = await DAI.deploy( 0 );
  console.log("AceBitERC20 address: %s", dai.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});