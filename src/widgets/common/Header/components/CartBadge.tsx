"use client";

import React from "react";

export function CartBadge({ count }: { count: number }) {
  return (
    <span
      className="absolute -top-[8px] -right-[10px] bg-[#e8083e] text-[#ffffff] text-[10px] font-[500] leading-[1] min-w-[18px] h-[18px] flex items-center justify-center rounded-[50%]"
      aria-hidden="true"
    >
      {count}
    </span>
  );
}
