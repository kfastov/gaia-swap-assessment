import React from "react";
import { formatUnits } from "viem";

interface SwapEventProps {
  event: any;
}

const SwapEvent: React.FC<SwapEventProps> = ({ event }) => {
  return (
    <li className="mb-2">
      <div className="text-black">
        <strong>Swap:</strong>
      </div>
      <div className="text-black">
        <strong>Amount0:</strong> {formatUnits(event.args.amountIn, 18)}
      </div>
      <div className="text-black">
        <strong>Amount1:</strong> {formatUnits(event.args.amountOut, 18)}
      </div>
      <div className="text-black">
        <strong>Block Number:</strong> {event.blockNumber}
      </div>
    </li>
  );
};

export default SwapEvent;
