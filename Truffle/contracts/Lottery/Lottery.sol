// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.9.0;

contract Lottery {
    address public owner;
    uint256 public ticketPrice;
    address[] public participants;
    mapping(address => uint) public ticketsCount;
    event TicketPurchase(address indexed buyer, uint ticketCount);
    event WinnerDrawer(address indexed winner, uint prizeAmount);

    modifier ownerOnly() {
        require(msg.sender == owner, "Only For Owner");
        _;
    }

    constructor(uint256 _ticketPrice) {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
    }

    function BuyTickets() public payable {
        require(msg.value == ticketPrice, "Insufficient funds");

        participants.push(msg.sender);
        ticketsCount[msg.sender]++;
        emit TicketPurchase(msg.sender, ticketsCount[msg.sender]);
    }

    function DrawWinner() public ownerOnly {
        require(participants.length > 0, "No Participants");

        uint winnerIndex = uint(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    participants
                )
            )
        ) % participants.length;

        address winnerAddress = participants[winnerIndex];
        uint prizeAmount = address(this).balance;

        (bool success, ) = winnerAddress.call{value: prizeAmount}("");
        require(success, "Failed to send prize");

        delete participants;

        emit WinnerDrawer(winnerAddress, prizeAmount);
    }

    function GetParticipants() public view returns (address[] memory) {
        return participants;
    }

    function GetTicketsCount(address _address) public view returns (uint) {
        return ticketsCount[_address];
    }

    function GetTicketPrice() public view returns (uint) {
        return ticketPrice;
    }
}
