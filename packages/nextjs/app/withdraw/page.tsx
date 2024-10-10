"use client";

import WithdrawForm from "../WithdrawForm";
import type { NextPage } from "next";

const Withdraw: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-3xl font-bold text-center mb-4">Remove Liquidity</h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-8 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <WithdrawForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdraw;
