// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./Auth.sol";

contract Membership {
    Auth private auth;

    mapping(address => address[]) members;

    constructor(address _authAddress) {
        auth = Auth(_authAddress);
    }

    event MemberAdded(address memberAddress);
    event MemberRemoved(address memberAddress);

    modifier OnlyAdmin(string memory error) {
        require(auth.checkHasRole(auth.AdminRoleAccess(), msg.sender), error);

        _;
    }

    function getAllMembers()
        public
        view
        OnlyAdmin("Only Admin can get their Members")
        returns (address[] memory)
    {
        return members[msg.sender];
    }

    function isMember(
        address memberAddress,
        address adminAddress
    ) public view returns (bool) {
        for (uint i = 0; i < members[adminAddress].length; i++) {
            if (members[adminAddress][i] == memberAddress) {
                return true;
            }
        }
        return false;
    }

    function addMember(
        address memberAddress
    ) public OnlyAdmin("Only Admin can add their Member") {
        members[msg.sender].push(memberAddress);
        emit MemberAdded(memberAddress);
    }

    function removeMember(
        address memberAddress
    ) public OnlyAdmin("Only Admin can remove their Member") {
        address[] storage adminMembers = members[msg.sender];
        bool removed = false;

        for (uint256 i = 0; i < adminMembers.length; i++) {
            if (adminMembers[i] == memberAddress) {
                adminMembers[i] = adminMembers[adminMembers.length - 1];
                adminMembers.pop();
                removed = true;

                emit MemberRemoved(memberAddress);
                break;
            }
        }

        require(removed, "Member not found");
    }
}
