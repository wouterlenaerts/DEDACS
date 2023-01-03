// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../Abac/Interfaces/IPolicy.sol";
import "../../Abac/Interfaces/IGovernanceManager.sol";
import "../../Abac/Interfaces/IUserManager.sol";
import "../../Abac/Interfaces/IEnvironmentManager.sol";
import "../../Abac/Interfaces/IResource.sol";

contract AttributesPolicy is IPolicy {
    IGovernanceManager governanceMgr;
    IUserManager userMgr;
    IEnvironmentManager environmentMgr;

    constructor(address governanceM) {
        governanceMgr = IGovernanceManager(governanceM);
        userMgr = IUserManager(governanceMgr.getUserManager());
        environmentMgr = IEnvironmentManager(governanceMgr.getEnvironmentManager());
    }

    function isAllowed(address user, address resource, bytes [] memory arguments) view override external returns (bool) {
        return userMgr.getSecurityClearance(user) < 2 
            && environmentMgr.getTime() > 1647350500
            && IResource(resource).getCreationDate() > 1580673602;
    }

    function getPolicyName() public override pure returns (string memory) {
            return "attributes";
    }
}