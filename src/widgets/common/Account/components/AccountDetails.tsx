"use client";

import React from "react";

interface CustomerDetail {
  label: string;
  value: string;
}

interface AccountDetailsProps {
  customerDetails: CustomerDetail[];
  accountDetailsTitle: string;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  customerDetails,
  accountDetailsTitle,
}) => {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight text-[#1D1D1D] my-5">
        {accountDetailsTitle}
      </h2>
      <div className="border-0 md:border md:border-neutral-200 rounded-none md:rounded-2xl overflow-hidden">
        <table className="w-full">
          <tbody>
            {customerDetails.map((detail, index) => (
              <tr
                key={index}
                className="border-b border-neutral-200 last:border-b-0"
              >
                <td className="w-[134.5px] font-normal md:font-bold text-primary text-xs md:text-sm px-0 md:px-2.5 py-[7px] border-r-0 md:border-r md:border-neutral-200 text-left">
                  {detail.label}
                </td>
                <td className="text-primary text-xs  md:text-sm px-0 md:px-2.5 py-2.5 text-right md:text-left">
                  {detail.value}
                </td>
              </tr>
            ))}
            {customerDetails.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className=" text-xs md:text-sm text-center text-neutral-500 p-5"
                >
                  No customer details available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
