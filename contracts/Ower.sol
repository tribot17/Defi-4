pragma solidity 0.8.12;

import "./Rec.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/FeedRegistryInterface.sol";

contract Ower is ChainlinkClient {
    struct Staker {
        uint256 balance;
        uint256 FirstDepositTime;
        uint256 reward;
        uint256 decimals;
    }

    mapping(address => address) public tokenPriceFeedMapping;
    mapping(address => mapping(address => Staker)) public staker;

    FeedRegistryInterface internal registry;
    Rec rec;
    uint256 public rate = 100;

    constructor(address _registry) {
        registry = FeedRegistryInterface(_registry);
    }

    function depositToken(
        address _token,
        uint256 _amount,
        uint256 decimals
    ) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        staker[msg.sender][_token].balance += _amount;
        staker[msg.sender][_token].decimals = decimals;
        staker[msg.sender][_token].reward = uint256(25);
        staker[msg.sender][_token].FirstDepositTime = block.timestamp;
    }

    function widthdrawToken(address _token, uint256 _amount) public {
        require(
            staker[msg.sender][_token].balance >= _amount,
            "Not enought token"
        );
        IERC20(_token).transferFrom(address(this), msg.sender, _amount);
        staker[msg.sender][_token].balance -= _amount;
    }

    function redeemReward(
        address _token,
        address USD,
        uint256 decimals
    ) public {
        require(
            block.timestamp >=
                staker[msg.sender][_token].FirstDepositTime + 24 hours
        );
        // rec.faucet(
        //     msg.sender,
        //     rewardBalance(_token, msg.sender, USD, decimals)
        // );
    }

    function setRewardValue(address _token) public {
        staker[msg.sender][_token].reward = uint256(25);
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
