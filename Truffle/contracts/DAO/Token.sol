// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address private owner;

    constructor(uint256 initialSupply) ERC20("Arsl", "MAK")  {
        _mint(msg.sender, initialSupply);
        owner = msg.sender;
    }

    function Mint(address to, uint256 amount) external {
        require(owner == msg.sender, "Onlyowner mint the token");
        _mint(to, amount);
    }

    function Burn(address to, uint256 amount) external {
        _burn(to, amount);
    }
}
