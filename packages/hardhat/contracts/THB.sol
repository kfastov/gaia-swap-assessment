//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the FaucetBase contract
import "./base/FaucetBase.sol";

// Define the THB contract that inherits from FaucetBase
contract THB is FaucetBase {
    // Constructor to initialize the token with a name, symbol, and initial supply
    constructor(uint256 initialSupply) ERC20("Thai Baht", "THB") {
        // Mint the initial supply to the contract deployer
        _mint(msg.sender, initialSupply);
    }
}