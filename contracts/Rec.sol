pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Rec is ERC20 {
    constructor() ERC20("Recompense Coin", "REC") {}

    // fonction faucet pour créer des Dai tokens
    function faucet(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}
