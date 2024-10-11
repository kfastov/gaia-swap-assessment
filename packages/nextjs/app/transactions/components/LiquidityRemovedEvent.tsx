import React from "react";
import { formatUnits } from "viem";

interface LiquidityRemovedEventProps {
  event: any;
  blockNumber: bigint;
  token0Name: string;
  token1Name: string;
}

const LiquidityRemovedEvent: React.FC<LiquidityRemovedEventProps> = ({
  event,
  blockNumber,
  token0Name,
  token1Name,
}) => {
  return (
    <li className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-lg">
      <div className="text-blue-700 font-bold mb-2">
        <strong>Liquidity Removed:</strong>
      </div>
      <div className="text-black">
        <strong>{token0Name}:</strong> {formatUnits(event.args.amount0, 18)}
      </div>
      <div className="text-black">
        <strong>{token1Name}:</strong> {formatUnits(event.args.amount1, 18)}
      </div>
      <div className="text-black">
        <strong>Block Number:</strong> {blockNumber.toString()}
      </div>
    </li>
  );
};

export default LiquidityRemovedEvent;
