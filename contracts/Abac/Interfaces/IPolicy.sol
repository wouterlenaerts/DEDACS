// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPolicy {
        function isAllowed(address user, address resource, bytes [] memory arguments) view external returns (bool);
        function getPolicyName() external view returns (string memory);
}