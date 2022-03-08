pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Rec.sol";

contract stakingCore {
    using SafeMath for uint256;
    Rec rec;
    mapping(address => uint256) private balance;
    mapping(address => uint256) private depositTime;
    mapping(address => uint256) private reward;

    event onDeposit(address from, uint256 value);

    receive() external payable {
        balance[msg.sender] += msg.value;
        depositTime[msg.sender] = block.timestamp;
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

    // function reward(address _address) private {
    //  rec.mint(rate, _address)
    // }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
