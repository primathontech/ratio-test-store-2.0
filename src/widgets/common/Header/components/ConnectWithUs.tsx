"use client";

import { Box } from "@/ui/atomic";
import Link from "next/link";
import React from "react";

declare global {
  interface Window {
    $chatwoot?: { toggle: () => void };
  }
}

interface ConnectWithUsItem {
  key: string;
  label: string;
  href: string;
}

interface ConnectWithUsProps {
  items?: ConnectWithUsItem[];
  onTrackOrderClick?: () => void;
}

const isChatItem = (key?: string) => key === "chat_with_us";
const isTrackOrderItem = (key?: string) => key === "track_order";

export const ConnectWithUs: React.FC<ConnectWithUsProps> = ({
  items = [],
  onTrackOrderClick,
}) => {
  return (
    <Box
      className="mx-5 flex flex-col gap-4 items-start mt-[15px]"
      data-testid="connect-with-us-container"
    >
      {items.map((item, index) =>
        isChatItem(item.key) ? (
          <div
            key={item.key}
            className="text-sm font-bold md:font-normal block cursor-pointer text-primary"
            data-testid="connect-with-us-chat"
            onClick={() => {
              if (typeof window !== "undefined" && window.$chatwoot) {
                window.$chatwoot.toggle();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (typeof window !== "undefined" && window.$chatwoot) {
                  window.$chatwoot.toggle();
                }
              }
            }}
            role="button"
            tabIndex={0}
          >
            {item.label}
          </div>
        ) : isTrackOrderItem(item.key) && onTrackOrderClick ? (
          <button
            key={item.key}
            type="button"
            onClick={onTrackOrderClick}
            className={`text-sm font-bold block cursor-pointer text-black text-left bg-transparent border-none p-0
              ${index === items.length - 1 ? "border-b border-current inline-block font-normal" : ""}
            `}
            data-testid={`connect-with-us-link-${item.key}`}
          >
            {item.label}
          </button>
        ) : (
          <Link
            key={item.key}
            href={item.href}
            className={`text-sm font-bold md:font-normal block
              ${index === items.length - 1 ? "border-b border-current inline-block text-black font-medium" : ""}
            `}
            data-testid={`connect-with-us-link-${item.key}`}
          >
            {item.label}
          </Link>
        )
      )}
    </Box>
  );
};

export default ConnectWithUs;
