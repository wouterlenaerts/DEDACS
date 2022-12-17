// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

interface IPermissionManager {
    function checkPermission(address user, string calldata functionName, bytes[] memory arguments) external view returns (bool);
}