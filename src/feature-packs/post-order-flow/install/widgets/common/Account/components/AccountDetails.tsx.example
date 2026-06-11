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
      <h2 className="text-[14px] font-bold text-black my-[20px]">
        {accountDetailsTitle}
      </h2>
      <div className="border-0 md:border md:border-gray-200 rounded-none md:rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {customerDetails.map((detail, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="w-[241px] font-normal md:font-bold text-black text-[14px] px-0 md:px-[10px] py-[7px] border-r-0 md:border-r md:border-gray-200 text-left">
                  {detail.label}
                </td>
                <td className="text-black text-[14px] px-0 md:px-[10px] py-[10px] text-right md:text-left">
                  {detail.value}
                </td>
              </tr>
            ))}
            {customerDetails.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center text-gray-500 p-[20px]">
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
