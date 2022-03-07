pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract stakingCore {
    using SafeMath for uint256;
    mapping(address => uint256) private balance;

    event onDeposit(address from, uint256 value);

    receive() external payable {
        balance[msg.sender] += msg.value;
        emit onDeposit(msg.sender, msg.value);
    }

    fallback() external payable {}

    function balanceOf(address _address) public view returns (uint256) {
        return balance[_address];
    }

    function withdrawMoney(uint256 value) public {
        require(value <= balance[msg.sender], "You don't enougth money");
        address payable to = payable(msg.sender);
        balance[msg.sender] -= value;
        to.transfer(value);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
