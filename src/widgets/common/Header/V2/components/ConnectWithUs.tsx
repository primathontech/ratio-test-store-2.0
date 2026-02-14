"use client";

import React from "react";
import { Box } from "@/ui/atomic";
import Link from "next/link";

interface ConnectWithUsItem {
  key: string;
  label: string;
  href: string;
}

interface ConnectWithUsProps {
  items?: ConnectWithUsItem[];
}

export const ConnectWithUs: React.FC<ConnectWithUsProps> = ({ items = [] }) => {
  return (
    <Box
      data-testid="connect-with-us-container"
      className="mx-8 flex flex-col gap-3 items-start mt-1"
    >
      {items.map((item, index) => (
        <Link
          key={item.key}
          data-testid={`connect-with-us-link-${item.key}`}
          href={item.href}
          className={`text-text-base font-bold block
            ${index === items.length - 1 ? "border-b border-current inline-block font-normal" : ""}
          `}
        >
          {item.label}
        </Link>
      ))}
    </Box>
  );
};

export default ConnectWithUs;
