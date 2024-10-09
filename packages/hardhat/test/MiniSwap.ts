import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { Contract } from "ethers";

// Define constants for initial balances
const INITIAL_THB_BALANCE = ethers.parseUnits("1000000", 18);
const INITIAL_TVER_BALANCE = ethers.parseUnits("500000", 18);

describe("MiniSwap", function () {
  let thbToken: Contract;
  let tverToken: Contract;
  let miniSwap: Contract;
  let deployer: string;

  before(async () => {
    // Deploy all contracts
    await deployments.fixture(["MiniSwap"]);

    // Get the deployer account
    const accounts = await ethers.getSigners();
    deployer = accounts[0].address;
    console.log("Deployer address:", deployer);

    // Get deployed contracts
    thbToken = await ethers.getContract("THB", deployer);
    tverToken = await ethers.getContract("TVER", deployer);
    miniSwap = await ethers.getContract("MiniSwap", deployer);
  });

  it("should deploy tokens and MiniSwap contract", async function () {
    expect(await thbToken.totalSupply()).to.equal(ethers.parseUnits("1000000", 18));
    expect(await tverToken.totalSupply()).to.equal(ethers.parseUnits("500000", 18));
  });

  it("should approve tokens to MiniSwap contract", async function () {
    const miniSwapAddress = await miniSwap.getAddress();
    await thbToken.approve(miniSwapAddress, ethers.parseUnits("1000", 18));
    await tverToken.approve(miniSwapAddress, ethers.parseUnits("2000", 18));

    expect(await thbToken.allowance(deployer, miniSwapAddress)).to.equal(ethers.parseUnits("1000", 18));
    expect(await tverToken.allowance(deployer, miniSwapAddress)).to.equal(ethers.parseUnits("2000", 18));
  });

  it("should add liquidity and receive liquidity tokens", async function () {
    await miniSwap.addLiquidity(ethers.parseUnits("1000", 18), ethers.parseUnits("2000", 18));

    const liquidityBalance = await miniSwap.balanceOf(deployer);
    expect(liquidityBalance).to.be.gt(0);
  });

  it("should remove liquidity and return initial token balances", async function () {
    const initialTHBBalance = INITIAL_THB_BALANCE;
    const initialTVERBalance = INITIAL_TVER_BALANCE;

    const liquidityBalance = await miniSwap.balanceOf(deployer);

    await miniSwap.removeLiquidity(liquidityBalance);

    const finalTHBBalance = await thbToken.balanceOf(deployer);
    const finalTVERBalance = await tverToken.balanceOf(deployer);

    expect(finalTHBBalance).to.equal(initialTHBBalance);
    expect(finalTVERBalance).to.equal(initialTVERBalance);
  });
});
