var Rec = artifacts.require("./Rec.sol");
var Ower = artifacts.require("./Ower.sol");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Rec);
  await deployer.deploy(Ower);
};
