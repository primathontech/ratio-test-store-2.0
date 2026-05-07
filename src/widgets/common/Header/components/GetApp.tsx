"use client";

import { Flex } from "@/ui/atomic";
import Image from "next/image";
import Link from "next/link";

interface GetAppData {
  app_url?: string;
  logo_url?: string;
  title?: string;
  description?: string;
  button_text?: string;
}

export const GetApp = ({ data }: { data?: GetAppData }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="app-widget bg-primary p-2 md:px-3 h-[75px] flex justify-between items-center gap-4">
      <Link
        href={"https://bblunt.com/cdn/shop/files/bbluntIcon.webp?v=1760440322"}
        className="app-widget-inner block no-underline text-white hover:text-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Flex align="center" justify="center" className="gap-6 md:gap-4">
          {/* App Logo */}
          <div className="rounded overflow-hidden shrink-0">
            {data?.logo_url && (
              <Image
                src={data.logo_url}
                alt={data.logo_url}
                width={37}
                height={37}
                className="object-contain"
              />
            )}
          </div>

          {/* App Widget Header */}
          <div>
            <h2 className="text-sm font-bold md:leading-tight md:mt-1">
              {data?.title}
            </h2>
            <p className="text-[11px] font-light md:mt-0">
              {data?.description}
            </p>
          </div>

          {/* App Widget Button */}
          <p className="app-widget-button h-[33px] w-[65px] text-xs p-3.5 font-bold rounded border whitespace-nowrap shrink-0 flex items-center justify-center">
            {data?.button_text}
          </p>
        </Flex>
      </Link>
    </div>
  );
};

export default GetApp;
