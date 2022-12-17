// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interfaces/IEnvironmentManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnvironmentManager is IEnvironmentManager, Ownable {
    uint256 threatLevel;

    function getTime() override external view returns(uint256) {
        return block.timestamp;
    }
    function getCurrentThreatLevel() override external view returns(uint256) {
        return threatLevel;
    }
    function setCurrentThreatLevel(uint256 level) override onlyOwner external {
        threatLevel = level;
    }
    function getCurrentMiner() override external view returns (address) {
        return block.coinbase;
    }
}