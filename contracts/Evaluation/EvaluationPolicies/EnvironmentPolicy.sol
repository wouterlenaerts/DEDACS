// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Abac/Interfaces/IPolicy.sol";
import "../Abac/Interfaces/IGovernanceManager.sol";
import "../Abac/Interfaces/IEnvironmentManager.sol";

contract EnvironmentPolicy is IPolicy {
    IGovernanceManager governanceMgr;
    IEnvironmentManager environmentMgr;

    constructor(address governanceM) {
        governanceMgr = IGovernanceManager(governanceM);
        environmentMgr = IEnvironmentManager(governanceMgr.getEnvironmentManager());
    }

    function isAllowed(address user, address resource, bytes [] memory arguments) view override external returns (bool) {
        return environmentMgr.getTime() > 1647350500;
    }

    function getPolicyName() public override pure returns (string memory) {
            return "environment";
    }
}