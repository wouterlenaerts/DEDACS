// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../Abac/Interfaces/IPolicy.sol";
import "../../Abac/Interfaces/IGovernanceManager.sol";
import "../../Abac/Interfaces/IEnvironmentManager.sol";
import "../../Abac/Interfaces/IUserManager.sol";
import "../../Abac/Interfaces/IResource.sol";
import "../../Libraries/ByteConversion.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RareTokenPolicy is IPolicy {
    mapping(string => bool) allowedStrings;
    IGovernanceManager governanceMgr;
    IUserManager userMgr;
    IEnvironmentManager environmentMgr;

    constructor(IGovernanceManager governanceM) {
        governanceMgr = governanceM;
        userMgr = IUserManager(governanceMgr.getUserManager());
        environmentMgr = IEnvironmentManager(governanceMgr.getEnvironmentManager());
    }

    function isAllowed(address user, address resource, bytes [] memory arguments) view override external returns (bool) {
        address from = ByteConversion.bytesToAddress(arguments[0]);
        address to = ByteConversion.bytesToAddress(arguments[1]);
        uint256 amount = ByteConversion.bytesToUint256(arguments[2], 0);
        return isAllowed(user, resource, from, to, amount);
    }

    function isAllowed(address user, address resourceAdr, address from, address to, uint256 amount) view internal returns (bool) {
        bool userExists = userMgr.checkUserExists(user);
        if (userExists && userMgr.hasRole(user, "gameContract")) {
            //Game contracts can transfer whatever they want.
            return true; 
        }
        return userExists && userMgr.checkUserExists(from) && userMgr.checkUserExists(to) 
            && (
                (amount <= 1000) 
                ||
                (amount <= 2000 && userMgr.hasRole(user, "level2"))
            );     
    }

    function getPolicyName() public override pure returns (string memory) {
            return "rareToken";
    }
}