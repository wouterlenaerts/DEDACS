// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//I changed the versions of these 2 contracts to >=0.7.0 so they both compile in 7 and 8!
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../../Demo/GameTokens/Interfaces/IGameToken.sol";

contract ResourceToken is IGameToken, ERC20, Ownable {

    address private poolAddress;
    uint creationDate;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        creationDate = block.timestamp;
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(creationDate > 1580673602 , "Is not allowed to transfer"); //date = 2 February 2020 20:00:02
    }

    function mint(uint256 amount) override public onlyOwner {
        _mint(msg.sender, amount);
    }

    function getTokenType() public override pure returns (string memory) {
        return "resource";
    }
}