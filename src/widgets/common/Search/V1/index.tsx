"use client";

import React from "react";
import type { SearchProps } from "../types";

const SearchV1: React.FC<SearchProps> = ({ settings }) => {
  return (
    <div className="min-h-screen bg-white px-0">
      <div className="mx-auto max-w-[1440px] px-[16px] md:px-[40px] py-[40px]">
        <p className="text-[14px] text-black">
          Search widget placeholder — variant: {settings?.variant || "v1"}
        </p>
      </div>
    </div>
  );
};

export default SearchV1;
