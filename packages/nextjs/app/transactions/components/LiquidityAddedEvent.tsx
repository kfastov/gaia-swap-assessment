import React from "react";
import { formatUnits } from "viem";

interface LiquidityAddedEventProps {
  event: any;
}

const LiquidityAddedEvent: React.FC<LiquidityAddedEventProps> = ({ event }) => {
  return (
    <li className="mb-2">
      <div className="text-black">
        <strong>Liquidity Added:</strong>
      </div>
      <div className="text-black">
        <strong>Amount0:</strong> {formatUnits(event.args.amount0, 18)}
      </div>
      <div className="text-black">
        <strong>Amount1:</strong> {formatUnits(event.args.amount1, 18)}
      </div>
      <div className="text-black">
        <strong>Block Number:</strong> {event.blockNumber}
      </div>
    </li>
  );
};

export default LiquidityAddedEvent;
