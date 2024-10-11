import React, { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Define the type for the token
type Token = {
  name: string;
  address: string;
};

const SwapForm: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [fromValue, setFromValue] = useState<string>("0.001");
  const [toValue, setToValue] = useState<string>("0");

  // Initialize the state with the correct type
  const [tokens, setTokens] = useState<Token[]>([]);

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const { data: thbContract, isLoading: thbContractLoading } = useScaffoldContract({ contractName: "THB" });
  const { data: tverContract, isLoading: tverContractLoading } = useScaffoldContract({ contractName: "TVER" });
  const { data: miniSwapContract } = useScaffoldContract({ contractName: "MiniSwap" });

  // Load reserves for price calculation
  const { data: reserve0, isLoading: reserve0Loading } = useScaffoldReadContract({
    contractName: "MiniSwap",
    functionName: "reserve0",
    watch: true,
  });

  const { data: reserve1, isLoading: reserve1Loading } = useScaffoldReadContract({
    contractName: "MiniSwap",
    functionName: "reserve1",
    watch: true,
  });

  // Load allowances for token approval
  const { data: allowanceTHB } = useScaffoldReadContract({
    contractName: "THB",
    functionName: "allowance",
    args: [address, miniSwapContract?.address],
    watch: true,
  });
  const { data: allowanceTVER } = useScaffoldReadContract({
    contractName: "TVER",
    functionName: "allowance",
    args: [address, miniSwapContract?.address],
    watch: true,
  });

  // Load decimals for token conversion
  const { data: thbDecimals, isLoading: thbDecimalsLoading } = useScaffoldReadContract({
    contractName: "THB",
    functionName: "decimals",
    watch: true,
  });
  const { data: tverDecimals, isLoading: tverDecimalsLoading } = useScaffoldReadContract({
    contractName: "TVER",
    functionName: "decimals",
    watch: true,
  });

  const { writeContractAsync: writeMiniSwapAsync } = useScaffoldWriteContract("MiniSwap");
  const { writeContractAsync: writeTHBAsync } = useScaffoldWriteContract("THB");
  const { writeContractAsync: writeTVERAsync } = useScaffoldWriteContract("TVER");

  useEffect(() => {
    const newTokens = [];
    if (!thbContractLoading && thbContract) {
      newTokens.push({ name: "THB", address: thbContract.address });
    }
    if (!tverContractLoading && tverContract) {
      newTokens.push({ name: "TVER", address: tverContract.address });
    }
    // Check if tokens have changed
    const tokensChanged = JSON.stringify(tokens) !== JSON.stringify(newTokens);

    if (tokensChanged) {
      setTokens(newTokens);
      setFromToken(newTokens[0] || null);
      setToToken(newTokens[1] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thbContractLoading, thbContract, tverContractLoading, tverContract]);

  const swapSufficient = () => {
    if (thbDecimalsLoading || tverDecimalsLoading || !thbDecimals || !tverDecimals) {
      return false;
    }
    if (fromToken?.name === "THB") {
      return allowanceTHB && allowanceTHB >= parseUnits(fromValue, thbDecimals);
    } else if (fromToken?.name === "TVER") {
      return allowanceTVER && allowanceTVER >= parseUnits(fromValue, tverDecimals);
    }
    return false;
  };

  const approveHandler = async () => {
    console.log("Approve");
    if (thbDecimalsLoading || tverDecimalsLoading || !thbDecimals || !tverDecimals) {
      return;
    }
    if (fromToken?.name === "THB") {
      await writeTHBAsync({
        functionName: "approve",
        args: [miniSwapContract?.address, parseUnits(fromValue, thbDecimals)],
      });
    } else if (fromToken?.name === "TVER") {
      await writeTVERAsync({
        functionName: "approve",
        args: [miniSwapContract?.address, parseUnits(fromValue, tverDecimals)],
      });
    }
  };

  const swapHandler = async () => {
    console.log("Swap");
    console.log("reserve0", reserve0);
    console.log("reserve1", reserve1);
    console.log("allowanceTHB", allowanceTHB);
    console.log("allowanceTVER", allowanceTVER);
    if (!fromToken || !toToken) {
      console.error("No tokens selected");
      return;
    }
    if (thbDecimalsLoading || tverDecimalsLoading || !thbDecimals || !tverDecimals) {
      return;
    }
    try {
      console.log(`Trying to swap ${parseUnits(fromValue, thbDecimals)} ${fromToken.name} to ${toToken.name}`);
      await writeMiniSwapAsync(
        {
          functionName: "swap",
          args: [parseUnits(fromValue, thbDecimals), fromToken.address],
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const calculateOutputAmount = (amountIn: bigint, tokenIn?: string) => {
    if (reserve0Loading || reserve1Loading || !reserve0 || !reserve1 || !tverDecimals || !thbDecimals) {
      return 0;
    }
    if (tokenIn === "THB") {
      return formatUnits((reserve1 * amountIn) / (reserve0 + amountIn), tverDecimals);
    } else if (tokenIn === "TVER") {
      return formatUnits((reserve0 * amountIn) / (reserve1 + amountIn), thbDecimals);
    }
    return 0;
  };

  return (
    <div className="w-96 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        {/* From Token Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              className="input input-bordered w-24 text-xl font-bold text-black bg-gray-100"
              value={fromValue}
              onChange={e => {
                const value = e.target.value;
                // Allow only numbers and a single decimal point
                if (/^\d*\.?\d*$/.test(value)) {
                  setFromValue(value);
                  setToValue(calculateOutputAmount(parseUnits(value, thbDecimals ?? 0), fromToken?.name).toString());
                }
              }}
            />
            <select
              className="select select-bordered"
              value={fromToken?.name || ""}
              onChange={e => {
                const selectedToken = tokens.find(token => token.name === e.target.value) || null;
                setFromToken(selectedToken);
              }}
            >
              {tokens.map(token => (
                <option key={token.name} value={token.name}>
                  {token.name}
                </option>
              ))}
            </select>{" "}
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>≈ $0.00</span>
            <span>Balance 0.00</span>
          </div>
        </div>
        {/*
        <div className="flex justify-between mb-4">
          <button className="btn btn-outline btn-sm text-black">25%</button>
          <button className="btn btn-outline btn-sm text-black">50%</button>
          <button className="btn btn-outline btn-sm text-black">75%</button>
          <button className="btn btn-outline btn-sm text-black">100%</button>
        </div>
        */}

        {/* Swap Icon 
        <div className="flex justify-center mb-4">
          <button className="btn btn-circle btn-outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6" />
            </svg>
          </button>
        </div>
        */}

        {/* To Token Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              className="input input-bordered w-24 text-xl font-bold text-black bg-gray-100"
              value={toValue}
              readOnly
            />
            <select
              className="select select-bordered"
              value={toToken?.name || ""}
              onChange={e => {
                const selectedToken = tokens.find(token => token.name === e.target.value) || null;
                setToToken(selectedToken);
              }}
            >
              {tokens.map(token => (
                <option key={token.name} value={token.name}>
                  {token.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>≈ $0.00</span>
            <span>Balance 0.00</span>
          </div>
        </div>

        {/* Connect/Approve/Swap Button */}
        <div className="mt-6">
          <button
            className="btn btn-primary w-full"
            onClick={isConnected ? (swapSufficient() ? swapHandler : approveHandler) : openConnectModal}
          >
            {isConnected ? (swapSufficient() ? "Swap" : "Approve") : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
