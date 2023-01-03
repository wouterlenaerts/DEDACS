// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

interface IGameSetup {    
    function getCommonToken() external view returns (address);
    function getRareToken() external view returns (address);
    function getGamer1() external view returns (address);
    function getGamer2() external view returns (address);
    function getPolicyName() external view returns (string memory);
}