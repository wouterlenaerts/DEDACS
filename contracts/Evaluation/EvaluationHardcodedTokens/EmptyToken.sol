// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//I changed the versions of these 2 contracts to >=0.7.0 so they both compile in 7 and 8!
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../../Demo/GameTokens/Interfaces/IGameToken.sol";

contract EmptyToken is IGameToken, ERC20, Ownable {

    address private poolAddress;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
    
    function mint(uint256 amount) override public onlyOwner {
        _mint(msg.sender, amount);
    }

    function getTokenType() public override pure returns (string memory) {
        return "empty";
    }
}