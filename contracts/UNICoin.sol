// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UNICoin is ERC20, Ownable {
    error InvalidAddress();
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(initialOwner) {
        if (initialOwner == address(0)) {
            revert InvalidAddress();
        }

        _mint(initialOwner, initialSupply);
    }
}
