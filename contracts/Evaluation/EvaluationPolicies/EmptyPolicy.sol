// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../Abac/Interfaces/IPolicy.sol";

contract EmptyPolicy is IPolicy {

    function isAllowed(address user, address resource, bytes [] memory arguments) pure override external returns (bool) {
        return true;
    }

    function getPolicyName() public override pure returns (string memory) {
            return "empty";
    }
}