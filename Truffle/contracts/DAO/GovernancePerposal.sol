// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Auth.sol";
import "./Token.sol";
import "./Membership.sol";

contract GovernancePerposal is Ownable {
    Auth public auth;
    Token public token;
    Membership public membership;

    struct Perposal {
        address perposer;
        string name;
        string description;
        uint256 voteCount;
        uint256 votePrice;
        bool excuted;
    }

    Perposal[] public perposals;
    mapping(uint256 => mapping(address => bool)) public votes;

    constructor(
        address _authAddress,
        address _tokenAddress,
        address _membershipAddress
    ) Ownable(msg.sender) {
        auth = Auth(_authAddress);
        token = Token(_tokenAddress);
        membership = Membership(_membershipAddress);
    }

    event PerposalCreated(Perposal createdPerposal, address perposer);
    event Voted(uint256 perposalId, address voter);
    event PerposalExcuted(uint256 perposalId);

    modifier onlyOwnerOrAdmin(string memory error) {
        bytes32 adminRole = auth.AdminRoleAccess();

        require(
            msg.sender == owner() || auth.checkHasRole(adminRole, msg.sender),
            error
        );
        _;
    }

    function createPerposal(string memory name,
        string memory description,
        uint256 price
    )
        public
        onlyOwnerOrAdmin("Only the owner or an admin can create new perposal")
    {
        Perposal memory newPerposal = Perposal({
            perposer: msg.sender,
            name:name,
            description: description,
            voteCount: 0,
            votePrice: price,
            excuted: false
        });
        perposals.push(newPerposal);

        emit PerposalCreated(newPerposal, msg.sender);
    }

    function vote(uint256 _perposalId, uint256 amount) public {
        require(_perposalId < perposals.length, "Invalid Perposal Id");
        require(
            membership.isMember(msg.sender, perposals[_perposalId].perposer),
            "Only member vote this perposal"
        );
        require(!votes[_perposalId][msg.sender], "Already voted.");
        require(!perposals[_perposalId].excuted, "Perposal already excuted");
        require(
            perposals[_perposalId].votePrice == amount,
            "Vote Price is not matched"
        );

        token.Burn(msg.sender, perposals[_perposalId].votePrice);
        perposals[_perposalId].voteCount++;
        votes[_perposalId][msg.sender] = true;
        emit Voted(_perposalId, msg.sender);
    }

    function getAllPerposal() public view returns (Perposal[] memory) {
        return perposals;
    }

    function excutePerposal(uint256 _perposalId) public onlyOwner {
        require(_perposalId < perposals.length, "Invalid perposal id");
        require(perposals[_perposalId].voteCount > 0, "Perposal has no vote");
        require(perposals[_perposalId].excuted, "Perposal already excuted");

        perposals[_perposalId].excuted = true;
        emit PerposalExcuted(_perposalId);
    }
}
