var Rec = artifacts.require("./Rec.sol");
var StackingCore = artifacts.require("./StackingCore.sol");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Rec);
  await deployer.deploy(
    StackingCore,
    "0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0"
  );
};
