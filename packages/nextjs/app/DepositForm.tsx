import React, { useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatUnits, parseEther, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const DepositForm: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [thbValue, setThbValue] = useState<string>("0");
  const [tverValue, setTverValue] = useState<string>("0");

  // Load user balances for automatic max liquidity deposit
  const { data: balanceTHB, isLoading: balanceTHBLoading } = useScaffoldReadContract({
    contractName: "THB",
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const { data: balanceTVER, isLoading: balanceTVERLoading } = useScaffoldReadContract({
    contractName: "TVER",
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const { data: decimalsTHB, isLoading: decimalsTHBLoading } = useScaffoldReadContract({
    contractName: "THB",
    functionName: "decimals",
    watch: true,
  });

  const { data: decimalsTVER, isLoading: decimalsTVERLoading } = useScaffoldReadContract({
    contractName: "TVER",
    functionName: "decimals",
    watch: true,
  });

  const { data: miniSwapContract } = useScaffoldContract({ contractName: "MiniSwap" });

  // Load allowances for token approval
  const { data: allowanceTHB, isLoading: allowanceTHBLoading } = useScaffoldReadContract({
    contractName: "THB",
    functionName: "allowance",
    args: [address, miniSwapContract?.address],
    watch: true,
  });

  const { data: allowanceTVER, isLoading: allowanceTVERLoading } = useScaffoldReadContract({
    contractName: "TVER",
    functionName: "allowance",
    args: [address, miniSwapContract?.address],
    watch: true,
  });

  const { writeContractAsync: writeMiniSwapAsync } = useScaffoldWriteContract("MiniSwap");
  const { writeContractAsync: writeTHBAsync } = useScaffoldWriteContract("THB");
  const { writeContractAsync: writeTVERAsync } = useScaffoldWriteContract("TVER");

  const approveHandler = async (token: string) => {
    console.log(`Approve ${token}`);
    if (token === "THB") {
      await writeTHBAsync({
        functionName: "approve",
        args: [miniSwapContract?.address, parseEther(thbValue.toString())],
      });
    } else if (token === "TVER") {
      await writeTVERAsync({
        functionName: "approve",
        args: [miniSwapContract?.address, parseEther(tverValue.toString())],
      });
    }
  };

  const depositHandler = async () => {
    console.log("Deposit");
    try {
      await writeMiniSwapAsync({
        functionName: "addLiquidity",
        args: [parseEther(thbValue.toString()), parseEther(tverValue.toString())],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getBalanceTHB = () => {
    if (balanceTHBLoading || decimalsTHBLoading || !balanceTHB || !decimalsTHB) {
      return "Loading...";
    }
    return formatUnits(balanceTHB, decimalsTHB);
  };

  const getBalanceTVER = () => {
    if (balanceTVERLoading || decimalsTVERLoading || !balanceTVER || !decimalsTVER) {
      return "Loading...";
    }
    return formatUnits(balanceTVER, decimalsTVER);
  };

  const handleButtonClick = () => {
    if (allowanceTHBLoading || allowanceTVERLoading) {
      return;
    }
    if (!isConnected) {
      openConnectModal?.();
    } else if (allowanceTHB && allowanceTHB < parseEther(thbValue)) {
      approveHandler("THB");
    } else if (allowanceTVER && allowanceTVER < parseEther(tverValue)) {
      approveHandler("TVER");
    } else {
      depositHandler();
    }
  };

  const getButtonLabel = () => {
    console.log("allowanceTHB", allowanceTHB);
    console.log("allowanceTVER", allowanceTVER);
    if (allowanceTHBLoading || allowanceTVERLoading) {
      return "Loading...";
    }
    if (!isConnected) {
      return "Connect";
    } else if (allowanceTHB && decimalsTHB && allowanceTHB < parseUnits(thbValue, decimalsTHB)) {
      return "Approve THB";
    } else if (allowanceTVER && decimalsTVER && allowanceTVER < parseUnits(tverValue, decimalsTVER)) {
      return "Approve TVER";
    } else {
      return "Deposit";
    }
  };

  return (
    <div className="w-96 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4 text-black">Amount to deposit</h2>

        {/* THB Input Section */}
        <div className="mb-4">
          <div className="flex justify-end items-center mb-2">
            <span className="text-sm text-gray-500 mr-2">Balance: {getBalanceTHB()}</span>
            <button className="btn btn-outline btn-sm text-black">Max</button>
          </div>
          <input
            type="text"
            className="input input-bordered w-full text-xl font-bold text-black bg-gray-100"
            value={thbValue}
            onChange={e => {
              const value = e.target.value;
              // Allow only numbers and a single decimal point
              if (/^\d*\.?\d*$/.test(value)) {
                setThbValue(value);
              }
            }}
          />
        </div>

        {/* TVER Input Section */}
        <div className="mb-4">
          <div className="flex justify-end items-center mb-2">
            <span className="text-sm text-gray-500 mr-2">Balance: {getBalanceTVER()}</span>
            <button className="btn btn-outline btn-sm text-black">Max</button>
          </div>
          <input
            type="text"
            className="input input-bordered w-full text-xl font-bold text-black bg-gray-100"
            value={tverValue}
            onChange={e => {
              const value = e.target.value;
              // Allow only numbers and a single decimal point
              if (/^\d*\.?\d*$/.test(value)) {
                setTverValue(value);
              }
            }}
          />
        </div>

        {/* Deposit Button */}
        <div className="mt-6">
          <button className="btn btn-primary w-full" onClick={handleButtonClick}>
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
