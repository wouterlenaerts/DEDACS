// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interfaces/IPermissionManager.sol";
import "./Interfaces/IUserManager.sol";
import "./Interfaces/IPolicyManager.sol";

contract PermissionManager is IPermissionManager {

    IPolicyManager public policyMgr;
    IUserManager public userMgr;

    constructor(address policyM, address userM) {
        policyMgr = IPolicyManager(policyM);
        userMgr = IUserManager(userM);
    }    

    function checkPermission(address user, string calldata operation, bytes[] memory arguments) external override view returns (bool) {
        require(userMgr.checkUserExists(user), 'UDNE');
        address resource = msg.sender;
        return policyMgr.isAllowedByPolicy(resource, operation, user, arguments);
    }
}