// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9.0;

//Changed the version of this interface to >=0.7.0 so this compiles with 7 and 8!
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IGameToken is IERC20 {
    function mint(uint256 amount) external;
    function getTokenType() external view returns (string memory);
}