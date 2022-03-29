const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const StakingCore = artifacts.require("./contracts/StakingCore.sol");
const { expect } = require("chai");

contract("StakingCore", (accounts) => {
  const sender = accounts[0];
  const ChainLink = "";

  beforeEach(async () => {
    this.StakingCoreInstance = await StakingCore.new({ from: sender });
  });

  it("Depose sur le contract", async () => {
    await this.StakingCoreInstance.depositToken(sender, 100000);

    let balanceSenderAfter = await this.StakingCoreInstance.stacker(
      sender,
      ChainLink
    );

    expect(balanceSenderAfter.balance()).to.be.a.bignumber.equal(
      new BN(100000)
    );
  });

  it("Retire du contract", async () => {
    await this.StakingCoreInstance.depositToken(sender, 100000);

    await this.StakingCoreInstance.withdrawToken(sender, 100000);

    let balanceSenderAfter = await this.StakingCoreInstance.stacker(
      sender,
      ChainLink
    );
    expect(balanceSenderAfter.balance()).to.be.a.bignumber.equal(new BN(0));
  });

  it("Ajoute deposit time", async () => {
    let balanceSenderAfter = await this.StakingCoreInstance.stacker(
      sender,
      ChainLink
    );
  });
});
