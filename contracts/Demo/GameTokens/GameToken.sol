// SPDX-License-Identifier: MIT

//pragma solidity ^0.7.6;
pragma solidity >=0.8.0 <0.9.0;
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";

//I changed the versions of these 2 contracts to >=0.7.0 so they both compile in 7 and 8!
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../../Abac/Interfaces/IResource.sol";
import "../../Abac/Interfaces/IPermissionManager.sol";
import "../../Libraries/ByteConversion.sol";
import "./Interfaces/IGameToken.sol";

contract GameToken is IGameToken, ERC20, Ownable, IResource {

    address private poolAddress;
    IPermissionManager public permissionMgr;
    uint creationDate;

    constructor(string memory name, string memory symbol, address permissionManager) ERC20(name, symbol) {
        permissionMgr = IPermissionManager(permissionManager);
        creationDate = block.timestamp;
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        //tokens should be handled through the pool, address(0) indicates minting or burning.
        // require (from == poolAddress || to == poolAddress || from == address(0) || to == address(0), "NotThrougPool");
        bytes[] memory arguments = new bytes[](3);
        arguments[0] = ByteConversion.addressToBytes(from);
        arguments[1] = ByteConversion.addressToBytes(to);
        arguments[2] = ByteConversion.uintToBytes(amount);
        //Should first argument be from or msg.sender? sender, from is already in the arguments.
        require(permissionMgr.checkPermission(msg.sender, "transferToken", arguments), "Is not allowed to transfer");
    }

    function mint(uint256 amount) override public onlyOwner {
        _mint(msg.sender, amount);
    }
    
    function getCreationDate() view override external returns (uint256) {
        return creationDate;
    }
    function getResourceOwner() view override external returns (address) {
        return owner();
    }
    function getSensitivity() pure override external returns (uint) {
        return 1;
    }

    function getTokenType() public override pure returns (string memory) {
        return "GameToken";
    }
}