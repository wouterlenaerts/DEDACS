// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../Abac/Interfaces/IPolicy.sol";
import "../../Abac/Interfaces/IGovernanceManager.sol";
import "../../Abac/Interfaces/IUserManager.sol";

contract UserPolicy is IPolicy {
    IGovernanceManager governanceMgr;
    IUserManager userMgr;

    constructor(address governanceM) {
        governanceMgr = IGovernanceManager(governanceM);
        userMgr = IUserManager(governanceMgr.getUserManager());
    }

    function isAllowed(address user, address resource, bytes [] memory arguments) view override external returns (bool) {
        return userMgr.getSecurityClearance(user) < 2;
    }

    function getPolicyName() public override pure returns (string memory) {
            return "user";
    }
}