// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Abac/Interfaces/IPolicy.sol";
import "../Libraries/ByteConversion.sol";

contract ArgumentsPolicy is IPolicy {

    function isAllowed(address user, address resource, bytes [] memory arguments) view override external returns (bool) {
        address from = ByteConversion.bytesToAddress(arguments[0]);
        address to = ByteConversion.bytesToAddress(arguments[1]);
        uint256 amount = ByteConversion.bytesToUint256(arguments[2], 0);
        return isAllowed(user, resource, from, to, amount);
    }

    function isAllowed(address user, address resourceAdr, address from, address to, uint256 amount) pure internal returns (bool) {
        return (from != 0x70997970C51812dc3A010C7d01b50e0d17dc79C8) 
                && (to != 0x70997970C51812dc3A010C7d01b50e0d17dc79C8) 
                && amount < 9000000000000;
    }

    function getPolicyName() public override pure returns (string memory) {
            return "arguments";
    }
}