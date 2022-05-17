const { ethers } = require("hardhat");
const constants = require('../utils/constants');

const NETWORK = process.env.NETWORK.toLowerCase();

async function main() {

  if ("Whitelist" in constants[NETWORK] && constants[NETWORK]["Whitelist"] != ""){
    throw new Error("Whitelist deploy error: contract exists");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account: " + deployer.address);

  const NeoWorldWhitelist = await ethers.getContractFactory("NeoWorldWhitelist");
  const neoWorldWhitelist = await NeoWorldWhitelist.deploy();
  console.log("NeoWorldWhitelist address: %s", neoWorldWhitelist.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});