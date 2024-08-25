// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Vote {
    struct Proposal {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    Proposal[] public proposals;

    constructor(string[] memory proposalNames) {
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function AddVote(uint256 proposal) public {
        require(!voters[msg.sender], "You have already voted.");
        voters[msg.sender] = true;
        proposals[proposal].voteCount += 1;
    }

    function getProposalByIndex(uint index) public view returns (string memory) {
        require(index < proposals.length, "Index out of bounds");
        return proposals[index].name;
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
