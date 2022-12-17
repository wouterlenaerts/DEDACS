// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//I changed the versions of these 2 contracts to >=0.7.0 so they both compile in 7 and 8!
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../GameTokens/Interfaces/IGameToken.sol";

contract AttributesAndArgumentsToken is IGameToken, ERC20, Ownable {

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
        require(
            msg.sender != 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
            && block.timestamp > 1647350500
            && creationDate > 1580673602 //date = 2 February 2020 20:00:02
            && (from != 0x70997970C51812dc3A010C7d01b50e0d17dc79C8) 
            && (to != 0x70997970C51812dc3A010C7d01b50e0d17dc79C8) 
            && amount < 9000000000000,
            "Is not allowed to transfer");
    }

    function mint(uint256 amount) override public onlyOwner {
        _mint(msg.sender, amount);
    }

    function getTokenType() public override pure returns (string memory) {
        return "attributesAndArguments";
    }
}