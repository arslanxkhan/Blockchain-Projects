// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAO is ERC20{
    function hello() public pure returns(string memory) {
        return "Hellow, World";
    }
}
