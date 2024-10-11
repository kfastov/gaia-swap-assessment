

# 🏗 MiniSwap for GaiaSwap Assignment

⚙️ Built using [Scaffold-ETH 2](https://scaffoldeth.io).

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/kfastov/gaia-swap-assessment.git
cd gaia-swap-assessment
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the http://localhost:3000/debug page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

5. Launching the backend server:

There supposed to be a backend server, but time ran out and I had to focus on the frontend.
The server draft can be started with `yarn backend:start`.

## Deployments

- [MiniSwap Contract](https://sepolia.etherscan.io/address/0x5f001c9fbd178cb156b9808368cef5f5864ef450)
- [THB Contract](https://sepolia.etherscan.io/address/0xe7a4E7e369B0F9A26422e255140Fe27273e71521)
- [TVER Contract](https://sepolia.etherscan.io/address/0xbd6fF8DfB02C1e807FAD9b2301e220F9e083a94f)
- [MiniSwap Frontend](https://gaia-swap-assessment-nextjs.vercel.app/)

## Code Overview

- `packages/hardhat/contracts/` - the contracts for the application
- `packages/nextjs/app/` - the frontend code (except of some preexisting code from Scaffold-Eth in `blockexplorer` and `debugger`)

## Design Decisions and Conclusions

### Writing the custom contract in Solidity
The best approach in the real world would be to fork the existing code from Uniswap and modify it according to the requirements. But since this is an assessment, I decided to write the contract from scratch. The result was not perfect and far from production ready, but it was a good exercise. The code contains some errors and lacks of some features that would be great to have in production:

- No fee collection: it would be better to have a fee mechanism
- No reentrancy protection
- The formula for liquidity deposit is valid only for the initial deposit
- The contract doesn't check that deposited tokens are balanced
- events don't comply with Uniswap standard and don't contain necessary data such as the address of the sender
and many other things

### Using Scaffold-Eth as a framework
Initially I thought that it's the best way to deploy several smart contracts in multiple chains and automatically update their addresses in the frontend. Also I chose it because of the limited time, because my experience with frontend development is limited and I wanted to focus on the task.

### Using viem and wagmi for interacting with the blockchain
I used viem and wagmi for interacting with the blockchain because of the ready-to-use hooks and the ability to connect to multiple chains, and also for type safety. But fetching multiple data from a single contract appeared to be a bit clumsy, so next time I would probably research on best practices or stick to ethers.js.

### Overall impression
I realize that I rather failed this task than succeeded, but it was really my first time of creating a full-stack Web3 application from scratch. One of my mistakes was that I spent too much time choosing the technologies instead of just starting to code. I know that next time I will do it better.

