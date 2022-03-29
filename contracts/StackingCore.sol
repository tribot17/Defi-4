pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";
import "./Rec.sol";

contract StackingCore is ChainlinkClient, Rec {
    struct Stacker {
        uint256 balance;
        uint256 DepositTime;
        uint256 LastUpdateTime;
        uint256 decimals;
        uint256 reward;
    }

    mapping(address => address) public tokenPriceFeedMapping;
    mapping(address => mapping(address => Stacker)) public stacker;

    FeedRegistryInterface internal registry;
    uint256 public rate = 1;
    address USD = 0x0000000000000000000000000000000000000348;

    constructor(address _registry) {
        registry = FeedRegistryInterface(_registry);
    }

    function depositToken(
        address _token,
        uint256 _amount,
        uint256 _decimals
    ) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        stacker[msg.sender][_token].balance += _amount;
        stacker[msg.sender][_token].decimals = _decimals;
        if (stacker[msg.sender][_token].DepositTime != uint256(0)) {
            updateReward(_token, msg.sender);
        } else {
            stacker[msg.sender][_token].DepositTime = block.timestamp;
        }
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(stacker[msg.sender][_token].balance >= _amount);
        IERC20(_token).transfer(msg.sender, _amount);
        stacker[msg.sender][_token].balance -= _amount;
    }

    function getRewardValue(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return
            ((getBalanceValue(_token, _user) / 100) * rate) *
            getTimeStamp(_token, _user);
    }

    function getBalanceValue(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return ((getBalance(_token, _user) * uint256(getPrice(_token, USD))));
    }

    function getTimeStamp(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return
            (block.timestamp -
                ((stacker[_user][_token].DepositTime -
                    stacker[_user][_token].LastUpdateTime) + block.timestamp)) /
            60;
    }

    function updateReward(address _token, address _user) internal {
        stacker[msg.sender][_token].reward =
            ((getBalanceValue(_token, _user) / 100) * rate) *
            getTimeStamp(_token, _user);
        stacker[_user][_token].LastUpdateTime = block.timestamp;
    }

    function reedemReward(address _token) public {
        require(getRewardValue(_token, msg.sender) > 0, "Nothing to reedem");
        updateReward(_token, msg.sender);
        _mint(msg.sender, stacker[msg.sender][_token].reward);
        stacker[msg.sender][_token].DepositTime = block.timestamp;
    }

    function getBalance(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return stacker[_user][_token].balance;
    }

    function getPrice(address base, address quote)
        public
        view
        returns (int256)
    {
        int8 decimals;
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = registry.latestRoundData(base, quote);
        return price / 10**8;
    }
}
