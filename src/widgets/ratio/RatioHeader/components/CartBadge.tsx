"use client";

import React from "react";

export function CartBadge({ count }: { count: number }) {
  return (
    <span
      className="absolute -top-2 -right-2.5 bg-[#1D1D1D] text-secondary text-[10px] font-medium leading-none min-w-[18px] h-[18px] flex items-center justify-center rounded-full"
      aria-hidden="true"
    >
      {count}
    </span>
  );
}
