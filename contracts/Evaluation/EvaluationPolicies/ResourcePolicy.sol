// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../Abac/Interfaces/IPolicy.sol";
import "../../Abac/Interfaces/IResource.sol";

contract ResourcePolicy is IPolicy {

    function isAllowed(address user, address resource, bytes [] memory arguments) view override external returns (bool) {
        return IResource(resource).getCreationDate() > 1580673602;
    }

    function getPolicyName() public override pure returns (string memory) {
            return "resource";
    }
}