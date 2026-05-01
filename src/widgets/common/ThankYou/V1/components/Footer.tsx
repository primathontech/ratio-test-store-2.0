import Link from "next/link";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-x-3.5 gap-y-1 md:gap-5 tracking-tighter md:tracking-normal text-xs text-[#005bd1] font-normal underline px-[21px] md:px-0 py-[21px] border-t border-[#d6d6d6]">
      <Link href="/pages/return-policy">Refund policy</Link>
      <Link href="/pages/privacy-policy">Privacy policy</Link>
      <Link href="/pages/terms-and-conditions">Terms of service</Link>
      <Link href="https://support.bblunt.com/support/home">
        Contact information
      </Link>
    </div>
  );
};
