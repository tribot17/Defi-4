pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Rec.sol";

contract stakingCore {
    using SafeMath for uint256;
    IERC20 public recToken;
    Rec rec;
    // AggregatorV3Interface internal priceFeed;
    mapping(address => uint256) private balance;
    mapping(address => uint256) private depositTime;
    mapping(address => uint256) private lastRewardTime;
    mapping(address => uint256) private rewardValue;
    mapping(address => address) public tokenPriceFeedMapping;

    event onDeposit(address from, uint256 value);

    constructor(address _recTokenAddress) public {
        recToken = IERC20(_recTokenAddress);
        // priceFeed = AggregatorV3Interface(
        //     0x9326BFA02ADD2366b30bacB125260Af641031331
        // );
    }

    receive() external payable {
        balance[msg.sender] += msg.value;
        depositTime[msg.sender] = block.timestamp;
        emit onDeposit(msg.sender, msg.value);
    }

    function stakeERC20(uint256 _amount, address _tokenAddress) public {
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
        balance[msg.sender] += _amount;
    }

    function withdrawMoney(uint256 value) public {
        require(value <= balance[msg.sender], "You don't enougth money");
        address payable to = payable(msg.sender);
        balance[msg.sender] -= value;
        to.transfer(value);
    }

    function reward(address _address) private {
        require(
            lastRewardTime[_address] >= lastRewardTime[_address] + 24 hours,
            "Not enought time spent"
        );
        //  rec.mint(val, _address);
        lastRewardTime[_address] = block.timestamp;
    }

    function balanceOf(address _address) public view returns (uint256) {
        return balance[_address];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTokenEthPrice(address token) public view returns (uint256) {
        address priceFeedAddress = tokenPriceFeedMapping[token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return uint256(price);
    }

    fallback() external payable {}
}
