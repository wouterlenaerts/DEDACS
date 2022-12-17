// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// Contracts ("resources") that will use the access control system should inherit from this contract.
interface IResource {
    function getCreationDate() view external returns (uint256);
    function getResourceOwner() view external returns (address);
    function getSensitivity() view external returns (uint);
}