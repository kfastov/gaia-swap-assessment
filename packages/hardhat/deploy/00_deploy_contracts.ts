import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys all relevant contracts using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySwapContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the THB token contract
  await deploy("THB", {
    from: deployer,
    args: [hre.ethers.parseUnits("1000000", 18)], // Example initial supply
    log: true,
    autoMine: true,
  });

  // Deploy the TVER token contract
  await deploy("TVER", {
    from: deployer,
    args: [hre.ethers.parseUnits("500000", 18)], // Example initial supply
    log: true,
    autoMine: true,
  });

  // Get the deployed THB contract to interact with it after deploying.
  const thbContract = await hre.ethers.getContract<Contract>("THB", deployer);
  console.log("THB Contract Address:", await thbContract.getAddress());

  // Get the deployed TVER contract to interact with it after deploying.
  const tverContract = await hre.ethers.getContract<Contract>("TVER", deployer);
  console.log("TVER Contract Address:", await tverContract.getAddress());

  // Deploy the MiniSwap contract for TVER and THB
  await deploy("MiniSwap", {
    from: deployer,
    args: [
      "MiniSwap", // Token name
      "MSWP", // Token symbol
      await thbContract.getAddress(),
      await tverContract.getAddress(),
    ],
    log: true,
    autoMine: true,
  });

  // Get the deployed MiniSwap contract to interact with it after deploying.
  const miniSwapContract = await hre.ethers.getContract<Contract>("MiniSwap", deployer);
  console.log("MiniSwap Contract Address:", await miniSwapContract.getAddress());
};

export default deploySwapContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deploySwapContracts.tags = ["MiniSwap"];
