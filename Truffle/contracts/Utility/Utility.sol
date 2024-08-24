// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <=0.9.0;

contract Utility {
    constructor() {}

    function GenerateKey(
        address userAdress,
        string memory itemName
    ) external view returns (bytes32) {
        // Generate a key based on the user's address and the item name
        return
            keccak256(
                abi.encodePacked(
                    userAdress,
                    itemName,
                    block.number,
                    block.timestamp
                )
            );
    }
}
