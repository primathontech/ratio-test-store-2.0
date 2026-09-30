"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@shopkit/core/context";
import { handleKwikpassLogin } from "@/integrations/kwikpass-custom";
import { FooterLink } from "../types";
import { AccordionToggleIcon } from "./AccordionToggleIcon";

interface MyAccountFooterSectionProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

export const MyAccountFooterSection: React.FC<MyAccountFooterSectionProps> = ({
  title,
  links,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { accessToken } = useAuth();
  const isLoggedIn = !!accessToken;

  if (!title || links.length === 0) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (!href) {
      return;
    }
    e.preventDefault();
    if (isLoggedIn) {
      router.push(href);
      return;
    }
    handleKwikpassLogin();
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={className}>
      <button
        onClick={toggleAccordion}
        className="w-full text-left flex justify-between items-center md:pointer-events-none md:cursor-default pt-6 md:pt-0 pb-6 md:pb-[30px]"
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
                : { onClick: (e) => handleLinkClick(e, link.href) })}
              className="text-sm max-w-[152px] text-[#E7E7E7] hover:text-loading-blue block font-normal cursor-pointer"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
