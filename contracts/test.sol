// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract test is ERC20, Ownable {
    constructor() ERC20("test", "TEST") Ownable(msg.sender) {
        _mint(msg.sender, 100000000000000000 * 10**decimals());
    }
}