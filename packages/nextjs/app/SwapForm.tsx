import React from "react";

const SwapForm: React.FC = () => {
  return (
    <div className="w-96 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        {/* From Token Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              className="input input-bordered w-24 text-xl font-bold text-black bg-gray-100"
              defaultValue="0.001"
            />
            <select className="select select-bordered">
              <option>TVER</option>
              {/* Add more options as needed */}
            </select>
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
              defaultValue="0.00"
            />
            <select className="select select-bordered">
              <option>ETH</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>≈ $0.00</span>
            <span>Balance 0.00</span>
          </div>
        </div>

        {/* Connect/Approve/Swap Button */}
        <div className="mt-6">
          <button className="btn btn-primary w-full">Connect</button>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
