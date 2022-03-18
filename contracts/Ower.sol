import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./StakingCore.sol";

contract Ower {
    uint256 public balance;
    ERC20 private ERC20Interface;
    address private tokenAddress;
    IERC20 public token;

    function transfer(address _token, uint256 _amount) external {
        // IERC20(_token).approve(address(this), _amount);

        if (
            ERC20Interface.transferFrom(msg.sender, address(this), _amount)
        ) {} else {
            revert("Unable to transfer funds");
        }
        // StakingCore stakingCore;
        // stakingCore.stakeERC20(_token, msg.sender, address(this), _amount);
    }

    function approuve(address _token, uint256 _amount) public {
        IERC20(_token).approve(msg.sender, _amount);
    }

    function transferFrom(uint256 _amount, address _token) public {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    }

    function setTokenAddress(address _tokenAddress) external {
        tokenAddress = _tokenAddress;
        ERC20Interface = ERC20(tokenAddress);
    }

    function balanceOf(address _token) external {
        StakingCore stakingCore;
        balance = IERC20(_token).balanceOf(msg.sender);
        // stakingCore.getBalance(_token, msg.sender);
    }
}
