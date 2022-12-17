// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interfaces/IPolicyManager.sol";
import "./Interfaces/IPolicy.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract PolicyManager is IPolicyManager, Ownable {
    
    mapping(address => mapping(string => address)) policies;
    //maps resource and function name to the address of the policy.

    function addPolicy(address resource, string calldata operation, address policyAddress) onlyOwner override external {
        policies[resource][operation] = policyAddress;
    }

    function deletePolicy(address resource, string calldata operation) onlyOwner override external {
        policies[resource][operation] = address(0);
    }

    function isAllowedByPolicy(address resource, string calldata operation, address user, bytes [] memory arguments) override external view returns (bool) {
        address policyAddress = policies[resource][operation];
        if (policyAddress == address(0)) {
            return false;
        }
        else {
            IPolicy policy = IPolicy(policyAddress);
            return policy.isAllowed(user, resource, arguments);
        }
    }
}