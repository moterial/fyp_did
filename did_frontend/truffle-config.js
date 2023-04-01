var HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "daring turtle present velvet reform story vehicle appear this pool mechanic elevator";
var privatekey = "c1f3a393d0adfaaead4303bdae71e7166cd49366bdec69f0fc75cf7ae2fdbaf2"
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
