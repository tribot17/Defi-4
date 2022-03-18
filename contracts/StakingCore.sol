pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
import "./Rec.sol";

contract StakingCore {
    function stakeERC20(
        address _token,
        address _sender,
        address _recipient,
        uint256 _amount
    ) external {
        IERC20(_token).transferFrom(_sender, _recipient, _amount);
    }

    function getBalance(address _token, address _sender)
        external
        returns (uint256)
    {
        IERC20(_token).balanceOf(_sender);
    }
}
