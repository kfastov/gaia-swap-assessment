import React from "react";
import { formatUnits } from "viem";

interface SwapEventProps {
  event: any;
  blockNumber: bigint;
  tokenInName: string;
  tokenOutName: string;
}

const SwapEvent: React.FC<SwapEventProps> = ({ event, blockNumber, tokenInName, tokenOutName }) => {
  return (
    <li className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-lg">
      <div className="text-blue-700 font-bold mb-2">
        <strong>Swap:</strong>
      </div>
      <div className="text-black">
        <strong>From:</strong> {formatUnits(event.args.amountIn, 18)} {tokenInName}
      </div>
      <div className="text-black">
        <strong>To:</strong> {formatUnits(event.args.amountOut, 18)} {tokenOutName}
      </div>
      <div className="text-black">
        <strong>Block Number:</strong> {blockNumber.toString()}
      </div>
    </li>
  );
};

export default SwapEvent;
