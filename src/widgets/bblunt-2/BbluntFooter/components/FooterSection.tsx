"use client";

import Link from "next/link";
import React, { useState } from "react";
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

  const aboutUsPadding =
    title === "About Us" ? "xl:pl-5 max-w-auto md:max-w-[169px]" : "";

  return (
    <div className={`${aboutUsPadding} ${className ?? ""}`}>
      <button
        onClick={toggleAccordion}
        className="w-full text-left flex justify-between items-center md:pointer-events-none md:cursor-default pt-6 md:pt-0 pb-6 md:pb-[30px] min-w-[169px]"
        aria-expanded={isOpen}
        aria-controls={`footer-section-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <h6 className="text-base font-extrabold text-white !leading-none md:leading-[25.92px]">
          {title}
        </h6>
        <AccordionToggleIcon isOpen={isOpen} />
      </button>
      <ul
        id={`footer-section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className={`overflow-hidden transition-all duration-[250ms] flex md:flex-col flex-wrap gap-y-1 md:gap-2.5 list-none p-0 m-0 ${
          isOpen
            ? "max-h-96 opacity-100 ease-in-out pb-6"
            : "max-h-0 opacity-0 md:max-h-none md:opacity-100 ease-out"
        }`}
      >
        {links.map((link, index) => (
          <li key={index} className="basis-1/2 flex-shrink-0">
            <Link
              href={link.href}
              {...(link.isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-sm max-w-[152px] text-[#E7E7E7] hover:text-loading-blue block font-normal leading-[22.4px]"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
