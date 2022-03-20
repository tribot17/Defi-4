pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() public ERC20("test", "TST") {
        _mint(msg.sender, 500000);
    }

    function faucet(address to, uint256 _amount) external {
        _mint(to, _amount);
    }
}
