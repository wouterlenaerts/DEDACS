// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IEnvironmentManager {
    function getTime() external view returns(uint256);
    function getCurrentThreatLevel() external view returns(uint256);
    function setCurrentThreatLevel(uint256 level) external;
    function getCurrentMiner() external view returns (address);
}