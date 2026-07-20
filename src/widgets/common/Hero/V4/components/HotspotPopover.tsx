"use client";

/**
 * HotspotPopover — the product mini-card revealed by a hotspot click.
 * Anchored INLINE (absolute, relative to the hotspot — not a body portal),
 * placement bottom-center with an 8px gap. Sizes faithful to the source look.
 */

import { ChevronRightIcon } from "../icons";

export interface HotspotPopoverProps {
  title: string;
  price: string;
  href: string;
  /** Hide price while still loading the live product (no flash of fallback). */
  loading?: boolean;
  /** "View product" → opens the quick-shop modal. */
  onViewProduct: () => void;
}

export function HotspotPopover({
  title,
  price,
  href,
  loading = false,
  onViewProduct,
}: HotspotPopoverProps) {
  return (
    <div
      data-testid="hero-popover"
      role="dialog"
      aria-label={title}
      className="cs-hero-v4__popover absolute left-1/2 top-full z-[5] mt-[8px] w-[154px] -translate-x-1/2 bg-white pt-[12px] text-left text-[#2a3743] shadow-[0_15px_45px_rgba(0,0,0,0.1)] motion-reduce:animate-none"
      style={{ transformOrigin: "center top" }}
    >
      <div className="flex flex-col gap-[5px] px-[12px]">
        <p className="m-0 font-body text-[14px] font-[400] leading-[19.6px] tracking-[0.4px] text-[#2a3743]">
          {title}
        </p>
        {!loading && price ? (
          <div className="flex gap-[4px] font-body text-[14px] font-[400] leading-[19.6px] tracking-[0.4px] text-[#2a3743]">
            <span>{price}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-[5px] flex px-[12px] py-[6px]">
        <a
          href={href}
          data-testid="hero-popover-link"
          onClick={(e) => {
            e.preventDefault();
            onViewProduct();
          }}
          aria-haspopup="dialog"
          className="flex items-center gap-[4px] bg-transparent p-0 font-body text-[12px] font-[400] uppercase leading-[16.8px] tracking-[2.4px] text-[#2a3743] transition-opacity duration-200 hover:opacity-70"
        >
          View product
          <ChevronRightIcon className="block h-[10px] w-[6px]" />
        </a>
      </div>
    </div>
  );
}
