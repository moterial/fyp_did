const Migrations = artifacts.require("Migrations");
const Did = artifacts.require("Did");

module.exports =function(deployer) {
deployer.deploy(Migrations);
deployer.deploy(Did);


};
