"use client";

import React, { useState } from "react";
import Link from "next/link";

import { FooterLink } from "../types";
import { AccordionToggleIcon } from "./AccordionToggleIcon";

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  title,
  links,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!title || links.length === 0) {
    return null;
  }

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${className}`}>
      {/* Mobile Accordion Header */}
      <button
        onClick={toggleAccordion}
        className="w-full text-left flex justify-between items-center md:pointer-events-none md:cursor-default pb-[24px] md:pb-4"
        aria-expanded={isOpen}
        aria-controls={`footer-section-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <h6 className="text-text-lg font-bold md:font-medium text-white md:tracking-[1.4px] !leading-none md:leading-[25.92px]">
          {title}
        </h6>

        {/* Plus/Minus Icon - Only visible on mobile */}
        <AccordionToggleIcon isOpen={isOpen} />
      </button>

      {/* Links Container */}
      <ul
        id={`footer-section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className={`overflow-hidden transition-all duration-[250ms] flex md:flex-col flex-wrap gap-y-[16px] md:gap-0 ${
          isOpen
            ? "max-h-96 opacity-100 ease-in-out pb-[24px]"
            : "max-h-0 opacity-0 md:max-h-none md:opacity-100 ease-out"
        }`}
      >
        {links.map((link: FooterLink, index: number) => (
          <li key={index} className="basis-1/2 flex-shrink-0">
            <Link
              href={link.href}
              className="text-text-sm text-white md:text-[#cecece] md:text-text-base hover:text-[#0089DD] block font-normal !leading-none md:!leading-[32px]"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
