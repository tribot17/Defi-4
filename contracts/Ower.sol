pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ower {
    mapping(address => mapping(address => uint256)) private balance;
    mapping(address => uint256) private depositTime;

    function depositToken(address _token, uint256 _amount) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        balance[msg.sender][_token] += _amount;
    }

    function widthdrawToken(address _token, uint256 _amount) public {
        IERC20(_token).transferFrom(address(this), msg.sender, _amount);
        balance[msg.sender][_token] -= _amount;
    }

    function getBalance(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return balance[_user][_token];
    }
}
