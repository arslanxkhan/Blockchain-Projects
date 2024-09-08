// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/RoleManager.sol";

contract Auth is AccessControl, Ownable {
    bytes32 public ADMIN_ROLE;
    RoleManager private roleManager;
    mapping(string => bytes32) public ROLES;

    constructor(address _roleManagerAddress) Ownable(msg.sender) {
        roleManager = RoleManager(_roleManagerAddress);

        ADMIN_ROLE = keccak256(
            abi.encodePacked(
                roleManager.getRoleName(roleManager.getAdminRole())
            )
        );
        makeAdmin(msg.sender);
    }

    function checkHasRole(
        bytes32 role,
        address account
    ) public view returns (bool) {
        return hasRole(role, account);
    }

    function makeAdmin(address account) public onlyOwner {
        _grantRole(ADMIN_ROLE, account);
    }

    function createNewRole(string memory roleName) public onlyOwner {
        bytes32 newRole = keccak256(abi.encodePacked(roleName));
        require(ROLES[roleName] == 0x0, "Role already exists");

        ROLES[roleName] = newRole;
    }

    function addAccountInRole(string memory roleName, address account) public {
        require(ROLES[roleName] != 0x0, "Role not found");

        _grantRole(ROLES[roleName], account);
    }

    function AdminRoleAccess() public view returns (bytes32) {
        return ADMIN_ROLE;
    }
}
