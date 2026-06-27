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
      <div className="group/row flex items-center justify-between py-1 text-[#545454] hover:text-loading-blue transition-colors duration-200 cursor-pointer">
        <Link
          href={group.items[0]?.href ?? "#"}
          className="text-sm leading-[22.4px] font-normal text-inherit no-underline"
        >
          {group.heading}
        </Link>
        <button
          type="button"
          className="p-1 text-inherit"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`Toggle ${group.heading}`}
        >
          <ChevronDownIcon
            className={`w-2.5 h-[7px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-linear ${
          open
            ? "grid-rows-[1fr] opacity-100 my-[15px]"
            : "grid-rows-[0fr] opacity-0 my-0"
        }`}
      >
        <ul
          className="list-none p-0 m-0 pl-[19px] flex flex-col gap-3.5 ml-0.5 border-l border-[#e0e0e0] overflow-hidden min-h-0"
          aria-hidden={!open}
        >
          {group.items.map((item, ii) => (
            <li key={ii}>
              <Link
                href={item.href}
                tabIndex={open ? 0 : -1}
                className="text-sm leading-[16.8px] font-normal text-[#545454] hover:text-loading-blue no-underline transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
