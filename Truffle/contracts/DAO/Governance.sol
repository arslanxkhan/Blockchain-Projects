// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Auth.sol";
import "./Token.sol";

contract Governance is Ownable {
    Auth public auth;
    Token public token;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    struct Perposal {
        address perposer;
        string description;
        uint256 voteCount;
        uint256 votePrice;
        bool excuted;
    }

    Perposal[] public perposals;
    mapping(uint256 => mapping(address => bool)) public votes;

    constructor(
        address _authAddress,
        address _tokenAddress
    ) Ownable(msg.sender) {
        auth = Auth(_authAddress);
        token = Token(_tokenAddress);
    }

    event PerposalCreated(Perposal createdPerposal, address perposer);
    event Voted(uint256 perposalId, address voter);

    modifier onlyOwnerOrAdmin(string memory error) {
        require(
            msg.sender == owner() || auth.checkHasRole(ADMIN_ROLE, msg.sender),
            error
        );
        _;
    }

    function createPerposal(
        string memory description,
        uint256 price
    )
        public
        onlyOwnerOrAdmin("Only the owner or an admin can call this function")
    {
        Perposal memory newPerposal = Perposal({
            perposer: msg.sender,
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
}
