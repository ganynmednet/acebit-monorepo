const { ethers } = require("hardhat");
const constants = require('../utils/constants');

const NETWORK = process.env.NETWORK.toLowerCase();

async function main() {

  if ("AceBitPresale" in constants[NETWORK] && constants[NETWORK]["AceBitPresale"] != ""){
    throw new Error("UserStorage deploy error: contract exists");
  }

  // acebit.address,
  // aAcebit.address,
  // dai.address,
  // dao.address,
  // userStorage.address,
  // "1000000000000000000000"

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account: " + deployer.address);

  const AceBitPresale = await ethers.getContractFactory("AceBitPresale");

  // deploy contract using owner *545
  const aceBitPresale = await AceBitPresale.deploy(
    constants[NETWORK]["ACEBIT"],
    constants[NETWORK]["aACEBIT"],
    constants[NETWORK]["DAI"],
    constants[NETWORK]["DAO"],
    constants[NETWORK]["UserStorage"],
    "1500000000000000000000"
  );

  console.log("AceBitPresale address: %s", aceBitPresale.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});