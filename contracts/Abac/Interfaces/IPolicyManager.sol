// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPolicyManager {
    function addPolicy(address resource, string calldata operation, address policyAddress) external;
    function deletePolicy(address resource, string calldata operation) external;
    function isAllowedByPolicy(address resource, string calldata operation, address user, bytes [] memory arguments) external view returns (bool);
}