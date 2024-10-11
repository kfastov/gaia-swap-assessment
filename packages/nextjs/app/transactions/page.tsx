"use client";

import React, { useEffect, useState } from "react";
import LiquidityAddedEvent from "./components/LiquidityAddedEvent";
import LiquidityRemovedEvent from "./components/LiquidityRemovedEvent";
import SwapEvent from "./components/SwapEvent";
import { decodeEventLog } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

// Define the expected structure of the event arguments
interface SwapEventArgs {
  tokenIn: string;
  tokenOut: string;
  // Add other properties if needed
}

const Transactions: React.FC = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<any[]>([]);

  const { data: miniSwapContract } = useScaffoldContract({ contractName: "MiniSwap" });
  const { data: thbContract } = useScaffoldContract({ contractName: "THB" });
  const { data: tverContract } = useScaffoldContract({ contractName: "TVER" });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!miniSwapContract || !address || !publicClient) return;

      try {
        const events = await publicClient.getLogs({
          address: miniSwapContract.address,
          fromBlock: 0n,
          toBlock: "latest",
        });

        console.log(events);
        setTransactions(events);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [miniSwapContract?.address, address]);

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4 text-black">Your Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((txn, index) => {
              if (!miniSwapContract) return null;
              const evt = decodeEventLog({
                abi: miniSwapContract?.abi,
                ...txn,
              });

              switch (evt.eventName) {
                case "LiquidityAdded":
                  return (
                    <LiquidityAddedEvent
                      key={index}
                      event={evt}
                      blockNumber={txn.blockNumber}
                      token0Name="TVER"
                      token1Name="THB"
                    />
                  );
                case "LiquidityRemoved":
                  return (
                    <LiquidityRemovedEvent
                      key={index}
                      event={evt}
                      blockNumber={txn.blockNumber}
                      token0Name="TVER"
                      token1Name="THB"
                    />
                  );
                case "Swap":
                  const swapArgs = evt.args as SwapEventArgs; // Type assertion
                  const tokenInName =
                    swapArgs.tokenIn === tverContract?.address
                      ? "TVER"
                      : swapArgs.tokenIn === thbContract?.address
                      ? "THB"
                      : "unknown";
                  const tokenOutName =
                    swapArgs.tokenOut === tverContract?.address
                      ? "TVER"
                      : swapArgs.tokenOut === thbContract?.address
                      ? "THB"
                      : "unknown";
                  return (
                    <SwapEvent
                      key={index}
                      event={evt}
                      blockNumber={txn.blockNumber}
                      tokenInName={tokenInName}
                      tokenOutName={tokenOutName}
                    />
                  );
                default:
                  return null;
              }
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;
