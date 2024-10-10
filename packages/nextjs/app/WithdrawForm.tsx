import React, { useState } from "react";

const RemoveLiquidityForm: React.FC = () => {
  const [withdrawValue, setWithdrawValue] = useState<string>("0");

  const handleWithdrawChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setWithdrawValue(value);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    const calculatedValue = (parseFloat(withdrawValue) * percentage).toString();
    setWithdrawValue(calculatedValue);
  };

  return (
    <div className="w-96 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4 text-black">Amount to withdraw</h2>

        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full text-xl font-bold text-black bg-gray-100"
            value={withdrawValue}
            onChange={e => handleWithdrawChange(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <button className="btn btn-outline btn-sm text-black" onClick={() => handlePercentageClick(0.25)}>
              25%
            </button>
            <button className="btn btn-outline btn-sm text-black" onClick={() => handlePercentageClick(0.5)}>
              50%
            </button>
            <button className="btn btn-outline btn-sm text-black" onClick={() => handlePercentageClick(0.75)}>
              75%
            </button>
            <button className="btn btn-outline btn-sm text-black" onClick={() => handlePercentageClick(1)}>
              Max
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button className="btn btn-primary w-full">Withdraw</button>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-md font-bold mb-2 text-black">Expected to receive</h3>
          <div className="flex justify-between text-black">
            <span>THB</span>
            <span>{/* Calculate and display THB amount here */}0</span>
          </div>
          <div className="flex justify-between text-black mt-2">
            <span>TVER</span>
            <span>{/* Calculate and display TVER amount here */}0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveLiquidityForm;
