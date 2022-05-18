const { ethers } = require("hardhat");
const constants = require('../utils/constants');

const NETWORK = process.env.NETWORK.toLowerCase();

async function main() {

  if ("aACEBIT" in constants[NETWORK] && constants[NETWORK]["aACEBIT"] != ""){
    throw new Error("aACEBIT deploy error: contract exists");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account: " + deployer.address);

  const AlphaAceBitERC20 = await ethers.getContractFactory("AlphaAceBitERC20");
  const alphaAceBitERC20 = await AlphaAceBitERC20.deploy();
  console.log("AlphaAceBitERC20 address: %s", alphaAceBitERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});