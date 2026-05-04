"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NavDropdownGroup } from "../types";

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="10"
    height="7"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 1.24243L5 6.24243L-2.18557e-07 1.24243L0.8875 0.354932L5 4.46743L9.1125 0.354931L10 1.24243Z"
      fill="currentColor"
    />
  </svg>
);

export function DropdownAccordion({
  group,
  className,
}: {
  group: NavDropdownGroup;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <div className="group/row flex items-center justify-between py-[4px] text-[#545454] hover:text-[#0089DD] transition-colors duration-200 cursor-pointer">
        <Link
          href={group.items[0]?.href ?? "#"}
          className="text-[14px] leading-[22.4px] font-[400] text-inherit no-underline"
        >
          {group.heading}
        </Link>
        <button
          type="button"
          className="p-[4px] text-inherit"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`Toggle ${group.heading}`}
        >
          <ChevronDownIcon
            className={`w-[10px] h-[7px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {open && (
        <ul className="list-none p-0 m-0 pl-[19px] flex flex-col gap-[14px] ml-[2px] border-l border-[#e0e0e0] my-[15px]">
          {group.items.map((item, ii) => (
            <li key={ii}>
              <Link
                href={item.href}
                className="text-[14px] leading-[16.8px] font-[400] text-[#545454] hover:text-[#0089DD] no-underline transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
