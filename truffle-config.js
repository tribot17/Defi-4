const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({ path: "./.env" });

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.CHAIN_ID);
      },
      network_id: 42,
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      timeoutBlocks: 200,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.CHAIN_ID);
      },
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: "0.8.12",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
        evmVersion: "byzantium",
      },
    },
  },
};
