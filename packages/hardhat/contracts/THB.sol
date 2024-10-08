// Import the OpenZeppelin ERC20 contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Define the THB contract
contract THB is ERC20 {
    // Constructor to initialize the token with a name, symbol, and initial supply
    constructor(uint256 initialSupply) ERC20("Thai Baht", "THB") {
        // Mint the initial supply to the contract deployer
        _mint(msg.sender, initialSupply);
    }
}