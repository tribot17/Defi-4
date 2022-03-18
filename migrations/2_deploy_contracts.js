var Rec = artifacts.require("./Rec.sol");
// var StackingCore = artifacts.require("./StakingCore.sol");
var Ower = artifacts.require("./Ower.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Ower);
  // await deployer.deploy(Rec);
  const rec = await Rec.deployed();
  // await deployer.deploy(StackingCore, rec.address);
};
