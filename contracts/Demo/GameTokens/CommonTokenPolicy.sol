// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../Abac/Interfaces/IPolicy.sol";
import "../../Abac/Interfaces/IGovernanceManager.sol";
import "../../Abac/Interfaces/IEnvironmentManager.sol";
import "../../Abac/Interfaces/IUserManager.sol";
import "../../Abac/Interfaces/IResource.sol";
import "../../Libraries/ByteConversion.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract CommonTokenPolicy is IPolicy {
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
        bool minting = false;
        bool burning = false;
        if (from == address(0)) {
            minting = true;
        }
        if (to == address(0)) {
            burning = true;
        }
        return userMgr.checkUserExists(user)
                && (userMgr.checkUserExists(from) || (minting && userMgr.hasRole(user, "gameContract")))
                && (userMgr.checkUserExists(to) || (burning && userMgr.hasRole(user, "gameContract")));
    }

    function getPolicyName() public override pure returns (string memory) {
        return "commonToken";
    }

}