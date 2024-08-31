// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Auth is AccessControl, Ownable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    mapping(string => bytes32) public ROLES;

    constructor() Ownable(msg.sender) {}

    function checkHasRole(
        bytes32 role,
        address account
    ) public view returns (bool) {
        return hasRole(role, account);
    }

    function makeAdmin(address account) public onlyOwner {
        _grantRole(ADMIN_ROLE, account);
    }
}
