var Rec = artifacts.require("./Rec.sol");
// var StackingCore = artifacts.require("./StakingCore.sol");
var Ower = artifacts.require("./Ower.sol");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Rec);
  // await deployer.deploy(Token);
  await deployer.deploy(Ower);
  // const rec = await Rec.deployed();
  // await deployer.deploy(StackingCore, rec.address);
};
