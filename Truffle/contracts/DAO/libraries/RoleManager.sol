// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RoleManager {
    enum Roles {
        Admin,
        Guest,
        Member
    }

    function getRoleName(Roles role) external pure returns (string memory) {
        string memory roleName = "Guest";

        if (role == Roles.Admin) {
            roleName = "ADMIN";
        } else if (role == Roles.Member) {
            roleName = "Member";
        }

        return roleName;
    }

    function getAdminRole() external pure returns (Roles) {
        return Roles.Admin;
    }

    function getGuestRole() external pure returns (Roles) {
        return Roles.Guest;
    }

    function getMemberRole() external pure returns (Roles) {
        return Roles.Member;
    }
}
