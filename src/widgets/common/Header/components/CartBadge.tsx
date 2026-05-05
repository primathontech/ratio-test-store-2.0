"use client";

import React from "react";

export function CartBadge({ count }: { count: number }) {
  return (
    <span
      className="absolute -top-2 -right-2.5 bg-[#e8083e] text-secondary text-[10px] font-medium leading-none min-w-[18px] h-[18px] flex items-center justify-center rounded-[50%]"
      aria-hidden="true"
    >
      {count}
    </span>
  );
}
