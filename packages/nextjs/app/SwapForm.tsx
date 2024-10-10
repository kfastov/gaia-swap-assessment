import React, { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Define the type for the token
type Token = {
  name: string;
  address: string;
};

const SwapForm: React.FC = () => {
  const [fromValue, setFromValue] = useState<number>(0.001);
  const [toValue, setToValue] = useState<number>(0);

  // Initialize the state with the correct type
  const [tokens, setTokens] = useState<Token[]>([]);

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const { data: thbContract, isLoading: thbContractLoading } = useScaffoldContract({ contractName: "THB" });
  const { data: tverContract, isLoading: tverContractLoading } = useScaffoldContract({ contractName: "TVER" });

  const { writeContractAsync } = useScaffoldWriteContract("MiniSwap");

  useEffect(() => {
    const newTokens = [];
    if (!thbContractLoading && thbContract) {
      newTokens.push({ name: "THB", address: thbContract.address });
    }
    if (!tverContractLoading && tverContract) {
      newTokens.push({ name: "TVER", address: tverContract.address });
    }
    if (newTokens.length > 0) {
      setTokens(newTokens);
      setFromToken(newTokens[0]);
      if (newTokens.length > 1) {
        setToToken(newTokens[1]);
      }
    }
  }, [thbContractLoading, thbContract, tverContractLoading, tverContract]);

  const swapHandler = async () => {
    console.log("Swap");
    if (!fromToken || !toToken) {
      console.error("No tokens selected");
      return;
    }
    try {
      await writeContractAsync(
        {
          functionName: "swap",
          args: [parseEther(fromValue.toString()), fromToken.address],
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

  console.log("Option 1: ", thbContractLoading ? "Loading..." : thbContract?.address ?? "Not found");
  console.log("Option 2: ", tverContractLoading ? "Loading..." : tverContract?.address ?? "Not found");

  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  const calculateToValue = (fromValue: number, price: number) => {
    return fromValue * price;
  };

  // Placeholder price for conversion
  const placeholderPrice = 1.5;

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
                const newFromValue = parseFloat(e.target.value);
                setFromValue(newFromValue);
                setToValue(calculateToValue(newFromValue, placeholderPrice));
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
        <div className="flex justify-between mb-4">
          <button className="btn btn-outline btn-sm text-black">25%</button>
          <button className="btn btn-outline btn-sm text-black">50%</button>
          <button className="btn btn-outline btn-sm text-black">75%</button>
          <button className="btn btn-outline btn-sm text-black">100%</button>
        </div>

        {/* Swap Icon */}
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
          <button className="btn btn-primary w-full" onClick={isConnected ? swapHandler : openConnectModal}>
            {isConnected ? "Swap" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
