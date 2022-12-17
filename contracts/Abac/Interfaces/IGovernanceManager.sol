// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IResource.sol";

interface IGovernanceManager {

    function getPermissionManager() external view returns (address);
    function getEnvironmentManager() external view returns (address);
    function getUserManager() external view returns (address);
    function getPolicyManager() external view returns(address);
}