require("dotenv").config();

require("@nomicfoundation/hardhat-toolbox");

// npx hardhat accounts
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  networks: {
    bsc_testnet_pk: {
      url: `https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5`,
      chainId: 97,
      gasPrice: 'auto',
      accounts: [process.env.WALLET_PRIVATE_KEY_OWNER]
    }
  },
  mocha: {
    timeout: 1000000
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  gasReporter: {
    enabled: true,
    noColors: false,
    showTimeSpent: true,
    showMethodSig: true,
    onlyCalledMethods: true
  }
};
