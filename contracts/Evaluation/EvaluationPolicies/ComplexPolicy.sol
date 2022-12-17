// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Abac/Interfaces/IPolicy.sol";
import "../Abac/Interfaces/IGovernanceManager.sol";
import "../Abac/Interfaces/IUserManager.sol";
import "../Abac/Interfaces/IEnvironmentManager.sol";
import "../Abac/Interfaces/IResource.sol";
import "../Libraries/ByteConversion.sol";

contract ComplexPolicy is IPolicy {
    IGovernanceManager governanceMgr;
    IUserManager userMgr;
    IEnvironmentManager environmentMgr;

    constructor(address governanceM) {
        governanceMgr = IGovernanceManager(governanceM);
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
        IResource resource = IResource(resourceAdr);
        return (from != 0x70997970C51812dc3A010C7d01b50e0d17dc79C8) 
                && (to != 0x70997970C51812dc3A010C7d01b50e0d17dc79C8) 
                && amount < 9000000000000
                //user attributes
                && !userMgr.hasRole(user, "role")
                && userMgr.getSecurityClearance(user) < 2 
                && keccak256(abi.encodePacked(userMgr.getUserName(user))) != keccak256(abi.encodePacked("fakeUser"))
                //environment attributes
                && environmentMgr.getTime() > 1647350500
                && environmentMgr.getCurrentThreatLevel() < 2
                && environmentMgr.getCurrentMiner() != address(0)
                //Resource attributes
                && resource.getSensitivity() < 2
                && resource.getResourceOwner() != address(0)
                && resource.getCreationDate() > 1580673602; //date = 2 February 2020 20:00:02
    }

    function getPolicyName() public override pure returns (string memory) {
            return "complex";
    }
}