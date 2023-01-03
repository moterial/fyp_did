var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "receive zero radio outer typical loyal split edge organ kiwi public bar";
var privatekey = "43307bb2ee62c8b7d6bbe37df835bdef3b3abcfe2221956b85b5bad5b6ffae06"
var rpcServer = "HTTP://127.0.0.1:7545"

module.exports = {
  networks: 
    // {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "5777", // Match any network id
    //   // gas: 5000000
    // }
    // ,
    {
      development:{
        provider: function() {
          return new HDWalletProvider(privatekey, rpcServer)
        }
        , network_id: 5777
      }
    }

  ,
  compilers: {
    solc: {
      version: "0.8.11", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
