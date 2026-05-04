"use client";

import React, { memo } from "react";
import Link from "next/link";
import { BreadcrumbProps, BreadcrumbItem } from "../types";

/* ------------------------------------------------------------------ */
/*  Inline SVG -- Chevron separator (right-pointing arrow)             */
/* ------------------------------------------------------------------ */

const ChevronSeparator = () => (
  <svg
    className="inline-block mx-[8px] md:mx-[10px]"
    xmlns="http://www.w3.org/2000/svg"
    width="5"
    height="8"
    viewBox="0 0 5 8"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0.886718 3.49691e-07L4.88672 4L0.886719 8L0.176719 7.29L3.46672 4L0.176719 0.71L0.886718 3.49691e-07Z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  V1 -- Breadcrumb (inline-flex nav with chevron separators)         */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: BreadcrumbProps) {
  const product = data?.success ? data.data : null;

  // Build breadcrumb from API data or fall back to settings
  const items: BreadcrumbItem[] = product
    ? [
        { text: "Home", href: "/" },
        ...(product.product_type
          ? [
              {
                text: product.product_type,
                href: `/collections/${product.product_type.toLowerCase().replace(/\s+/g, "-")}`,
              },
            ]
          : []),
        { text: product.title },
      ]
    : settings?.items || [];

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={["bg-[#ffffff]", className || ""].join(" ")}
    >
      {/* Outer wrapper with vertical padding */}
      <div className={["py-[11px]", "md:py-[13px]", "xl:py-[15px]"].join(" ")}>
        {/* Container -- horizontal padding + max-width */}
        <div
          className={[
            "mx-auto",
            "px-[15px]",
            "md:px-[30px]",
            "xl:px-[50px] xl:max-w-[1400px]",
          ].join(" ")}
        >
          {/* Breadcrumb list */}
          <ol
            className={[
              "inline-flex items-center flex-wrap",
              "gap-[6px]",
              "list-none m-0 p-0",
              "text-[#545454]",
              "max-w-full overflow-hidden",
            ].join(" ")}
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={index} className="inline-flex items-center">
                  {/* Separator before all items except the first */}
                  {index > 0 && <ChevronSeparator />}

                  {isLast || !item.href ? (
                    /* Current page -- bold span, no link */
                    <span
                      className={[
                        "",
                        "text-[14px] leading-[22px]",
                        "font-[700]",
                        "text-[#545454]",
                        "inline",
                      ].join(" ")}
                    >
                      {item.text}
                    </span>
                  ) : (
                    /* Linked breadcrumb item */
                    <Link
                      href={item.href}
                      className={[
                        "",
                        "text-[14px] leading-[22px]",
                        "font-[400]",
                        "text-[#545454]",
                        "no-underline",
                        "transition-colors duration-300",
                        "hover:text-[#0089dd]",
                        "inline-block",
                      ].join(" ")}
                    >
                      {item.text}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
});
