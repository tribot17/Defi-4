const {BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const StakingCore = artifacts.require("./contracts/StakingCore.sol"); 
const {expect} = require("chai");

contract("StakingCore", (accounts) => {
    const sender = accounts[0];

    beforeEach(async () => {
        this.StakingCoreInstance = await StakingCore.new({from: sender});
    });
    
    
    it("Depose sur le contract", async () => {
        let balanceSenderBefore = await this.StakingCoreInstance.balanceOf(sender);
        let balanceContractBefore = await this.StakingCoreInstance.balanceOf(this.StakingCoreInstance.address);
        
        await this.StakingCoreInstance.receive(sender, 100000);

        let balanceSenderAfter = await this.StakingCoreInstance.balanceOf(sender);
        let balanceContractAfter = await this.StakingCoreInstance.balanceOf(this.StakingCoreInstance.address);
        
        expect(balanceSenderAfter).to.be.a.bignumber.equal(new BN(100000));
    });
});


