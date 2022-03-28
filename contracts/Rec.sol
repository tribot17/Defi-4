pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Rec is ERC20 {
    constructor() ERC20("Recompense Coin", "REC") {
        // _mint(msg.sender, 100000000000000000000000000000000);
    }

    function faucet(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}
