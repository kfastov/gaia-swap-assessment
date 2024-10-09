
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
contract MiniSwap is ERC20 {
    address public immutable token0;
    address public immutable token1;
    uint256 public reserve0; // Reserve for token0
    uint256 public reserve1; // Reserve for token1

    // Constructor to initialize the token
    constructor(
        string memory name, 
        string memory symbol, 
        address _token0,
        address _token1
    ) ERC20(name, symbol) {
        // Initialize token addresses
        token0 = _token0;
        token1 = _token1;
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external {
        require(amount0 > 0 && amount1 > 0, "Amounts must be greater than zero");

        // Transfer token0 from the caller to the contract
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);

        // Transfer token1 from the caller to the contract
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);

        // Update reserves
        reserve0 += amount0;
        reserve1 += amount1;

        // Mint the LP token to the caller using the square root of the product
        uint256 liquidity = Math.sqrt(amount0 * amount1);
        _mint(msg.sender, liquidity);

        // Emit an event for adding liquidity
        emit LiquidityAdded(msg.sender, amount0, amount1);
    }

    function removeLiquidity(uint256 liquidity) external {
        require(liquidity > 0, "Liquidity must be greater than zero");

        // Burn the LP token from the caller
        _burn(msg.sender, liquidity);

        // Calculate the amount of token0 and token1
        uint256 totalSupply = totalSupply();
        uint256 amount0 = (reserve0 * liquidity) / totalSupply;
        uint256 amount1 = (reserve1 * liquidity) / totalSupply;

        // Transfer the corresponding amount of token0 and token1 back to the caller
        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);

        // Update reserves
        reserve0 -= amount0;
        reserve1 -= amount1;

        // Emit an event for removing liquidity
        emit LiquidityRemoved(msg.sender, amount0, amount1);
    }

    function swap(uint256 amountIn, address tokenIn) external {
        require(amountIn > 0, "Amount must be greater than zero");
        require(tokenIn == token0 || tokenIn == token1, "Invalid token");

        // Determine which token is being swapped
        (address tokenOut, uint256 reserveIn, uint256 reserveOut) = 
            tokenIn == token0 ? (token1, reserve0, reserve1) : (token0, reserve1, reserve0);

        // Transfer the input tokens from the caller to the contract
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Calculate the amount of output tokens using the constant product formula

        uint256 amountOut = (reserveOut * amountIn) / (reserveIn + amountIn);

        // Update reserves
        if (tokenIn == token0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
        }

        // Transfer the output tokens to the caller
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        // Emit an event for the swap
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    // Define the event
    event LiquidityAdded(address indexed provider, uint256 amount0, uint256 amount1);
    event LiquidityRemoved(address indexed provider, uint256 amount0, uint256 amount1);
    event Swap(address indexed swapper, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
}
