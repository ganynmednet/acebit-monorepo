require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require('dotenv').config();

// import { getApi } from "./utils/network";
const network = require("./utils/network");

//https://docs.polygon.technology/docs/develop/hardhat

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  defaultNetwork: "hardhat",
  gasReporter: {
    // currency: 'EUR',
    // gasPrice: 35,
    enabled: false,
    token: "MATIC",
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice"
  },
  networks: {
    hardhat: {
    },
    mumbai: {
      url: network.node_uri('mumbai'),
      accounts: [network.apiKey('mumbai')]
    },
    matic: {
      url: network.node_uri('matic'),
      accounts: [network.apiKey('matic')]
    },
    fantom_test: {
      url: network.node_uri('fantom_test'),
      accounts: [network.apiKey('fantom_test')]
    }
  },
  solidity: {
    compilers: [
        {
            version: "0.8.0",
            settings: {
                metadata: {
                    bytecodeHash: "none",
                },
                optimizer: {
                    enabled: true,
                    runs: 800,
                },
            },
        },
        {
            version: "0.8.6",
            settings: {
              metadata: {
                  bytecodeHash: "none",
              },
              optimizer: {
                  enabled: true,
                  runs: 800,
              },
          },
        },
        {
          version: "0.8.2",
          settings: {
            metadata: {
                bytecodeHash: "none",
            },
            optimizer: {
                enabled: true,
                runs: 800,
            },
          },
        },
        {
          version: "0.7.5",
          settings: {
            metadata: {
                bytecodeHash: "none",
            },
            optimizer: {
                enabled: true,
                runs: 800,
            },
          },
        }
    ],
    settings: {
        outputSelection: {
            "*": {
                "*": ["storageLayout"],
            },
        },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  etherscan: {
    apiKey: process.env.POLYGON_API_KEY
  }
}
