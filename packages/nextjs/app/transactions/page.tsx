"use client";

import React, { useEffect, useState } from "react";
import LiquidityAddedEvent from "./components/LiquidityAddedEvent";
import LiquidityRemovedEvent from "./components/LiquidityRemovedEvent";
import SwapEvent from "./components/SwapEvent";
import { decodeEventLog } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const Transactions: React.FC = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: miniSwapContract } = useScaffoldContract({ contractName: "MiniSwap" });
  const [transactions, setTransactions] = useState<any[]>([]);

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
    <div className="w-96 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
              console.dir(evt);
              switch (evt.eventName) {
                case "LiquidityAdded":
                  return <LiquidityAddedEvent key={index} event={evt} />;
                case "LiquidityRemoved":
                  return <LiquidityRemovedEvent key={index} event={evt} />;
                case "Swap":
                  return <SwapEvent key={index} event={evt} />;
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
