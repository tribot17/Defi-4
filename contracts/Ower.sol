pragma solidity 0.8.12;

import "./Rec.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";

contract Ower is ChainlinkClient {
    mapping(address => mapping(address => uint256)) private balance;
    mapping(address => uint256) private depositTime;
    mapping(address => mapping(address => uint256)) public depositValue;
    mapping(address => uint256) private reward;
    mapping(address => address) public tokenPriceFeedMapping;

    FeedRegistryInterface internal registry;
    Rec rec;
    uint256 public rate = 1;

    function depositToken(
        address _token,
        uint256 _amount,
        uint256 value
    ) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        balance[msg.sender][_token] += _amount;
        depositValue[msg.sender][_token] += value * _amount;
        depositTime[msg.sender] = block.timestamp;
    }

    function widthdrawToken(
        address _token,
        uint256 _amount,
        uint256 value
    ) public {
        require(balance[msg.sender][_token] >= _amount, "Not enought token");
        IERC20(_token).transferFrom(address(this), msg.sender, _amount);
        balance[msg.sender][_token] -= _amount;
        depositValue[msg.sender][_token] -= value * _amount;
    }

    function redeemReward(address _token) public {
        require(block.timestamp >= depositTime[msg.sender] + 24 hours);
        reward[msg.sender] = (depositValue[msg.sender][_token] *
            (rate * ((depositTime[msg.sender] - block.timestamp) / 24)));
        rec.faucet(msg.sender, reward[msg.sender]);
    }

    function getReward(address _token) public returns (uint256) {
        return depositValue[msg.sender][_token];
    }

    function getBalance(
        address _token,
        address _user,
        uint256 decimals
    ) public view returns (uint256) {
        return balance[_user][_token] / 10**decimals;
    }

    function addressBalance(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return balance[_user][_token];
    }
}
