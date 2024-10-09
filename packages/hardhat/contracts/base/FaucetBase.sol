//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the OpenZeppelin ERC20 contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Define the base contract with the faucet functionality
abstract contract FaucetBase is ERC20 {
    mapping(address => uint256) public lastAccessTime;

    function faucet() external {
        require(block.timestamp - lastAccessTime[msg.sender] > 1 hours, "Faucet can only be used once per hour");
        uint256 amount = 1000 * (10 ** decimals());
        _mint(msg.sender, amount);
        lastAccessTime[msg.sender] = block.timestamp;
    }
}
