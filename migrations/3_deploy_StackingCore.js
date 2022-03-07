var StackingCore = artifacts.require("./StakingCore.sol");

module.exports = function (deployer) {
  deployer.deploy(StackingCore);
}
