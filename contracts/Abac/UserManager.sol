// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interfaces/IUserManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UserManager is IUserManager, Ownable {
    mapping(address => User) users;
    struct User {
        address userAddr;
        mapping(string => bool) roles; //The roles of the user;
        string userName;
        uint securityClearance;
    }

    function checkUserExists(address user) public override view returns(bool) {
        return users[user].userAddr != address(0);
    }
    
    function addUser(address user) onlyOwner external override {
        if (!checkUserExists(user)) {
            User storage newUser = users[user];
            newUser.userAddr = user;
        }        
    }

    function deleteUser(address user) onlyOwner external override {
        if (checkUserExists(user)) {
            users[user].userAddr = address(0);
        }   
    }
 
    function grantRole(address user, string calldata role) onlyOwner external override {
        if (checkUserExists(user)) {
            users[user].roles[role] = true;
        }
    }
    function revokeRole(address user, string calldata role) onlyOwner external override {
        if (checkUserExists(user)) {
            users[user].roles[role] = false;
        }
    }
    function hasRole(address user, string calldata role) external override view returns (bool) {
        if (checkUserExists(user)) {
            return users[user].roles[role];
        }
        return false;
    }

    function updateUserName(address user, string calldata name) onlyOwner external override {
        require(checkUserExists(user), "UNE");
        users[user].userName = name;
    }

    function updateSecurityClearance(address user, uint256 newLevel) onlyOwner external override {
        require(checkUserExists(user), "UNE");
        users[user].securityClearance = newLevel;
    }

    function getUserName(address user) external override view returns(string memory) {
        require(checkUserExists(user), "UNE");
        return users[user].userName;
    }

    function getSecurityClearance(address user) external override view returns(uint256) {
        require(checkUserExists(user), "UNE");
        return users[user].securityClearance;
    }
}