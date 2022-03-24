pragma solidity 0.8.12;

import "./Rec.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";

contract StackingCore is ChainlinkClient {
    struct Stacker {
        uint256 balance;
        uint256 FirstDepositTime;
        uint256 reward;
        uint256 decimals;
    }

    mapping(address => address) public tokenPriceFeedMapping;
    mapping(address => mapping(address => Stacker)) public stacker;

    FeedRegistryInterface internal registry;
    Rec rec;
    uint256 public rate = 10;
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
        stacker[msg.sender][_token].FirstDepositTime = block.timestamp;
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(stacker[msg.sender][_token].balance >= _amount);
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        stacker[msg.sender][_token].balance -= _amount;
    }

    function getRewardValue(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return (getBalance(_token, _user) * uint256(getPrice(_token, USD)));
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
