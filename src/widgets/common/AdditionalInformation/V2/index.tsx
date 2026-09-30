"use client";

import { useState } from "react";
import { AdditionalInformationProps } from "../types";

export function V2({ data, settings }: AdditionalInformationProps) {
  const [isOpen, setIsOpen] = useState(settings?.defaultExpanded ?? false);
  const collectionData = data?.data as
    { data?: { collectionByHandle?: { description?: string } } } | undefined;
  const description =
    collectionData?.data?.collectionByHandle?.description ?? "";
  const title = settings?.title || "Additional Information";

  if (!description) {
    return null;
  }

  return (
    <div className="collection-additional-info px-[16px] md:px-12 xl2:px-20 xl3:px-0 xl3:max-w-[1300px] xl3:mx-auto">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-[15px] mb-[20px] text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-[16px] md:text-[28px] font-bold text-black text-center">
          {title}
        </span>

        <svg
          className={`flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 11 7"
          fill="none"
        >
          <path
            d="M-2.40413e-07 5.5L5.5 -2.40413e-07L11 5.5L10.0237 6.47625L5.5 1.9525L0.976249 6.47625L-2.40413e-07 5.5Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      <div
        className={`grid transition-all duration-400 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className="prose max-w-none !text-primary [&_h1]:!font-normal [&_h1]:text-[24px] [&_h1]:md:text-[40px] [&_h1]:mb-[10px] [&_h2]:text-[24px] [&_h2]:md:text-[36px] [&_h2]:mb-[10px] [&_h2]:!font-normal [&_h3]:text-[22px] [&_h3]:md:text-[32px] [&_h3]:mb-[10px] [&_h3]:!font-normal [&_p]:text-[14px] [&_p]:mb-[10px] [&_ol]:text-[14px] [&_p]:!font-normal [&_ol]:md:text-[14px] [&_ol]:mb-[10px] [&_ol]:!font-normal"
            // eslint-disable-next-line no-restricted-syntax
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
}
