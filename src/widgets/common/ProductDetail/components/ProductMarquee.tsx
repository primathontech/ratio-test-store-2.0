"use client";

import Link from "next/link";

interface ProductMarqueeProps {
  text: string;
  couponCode?: string;
  speed?: string;
  backgroundColor?: string;
  textColor?: string;
  badgeBackgroundColor?: string;
  badgeTextColor?: string;
  href?: string;
}

const COPIES = 4;
const TRANSLATE = `${100 / COPIES}%`;

/**
 * Coupon-code marquee that scrolls under the price block. Renders four copies
 * of `text` in a row and CSS-animates a `translateX` of one copy width — that
 * way the loop is seamless without JS bookkeeping.
 *
 * If `couponCode` is provided, a small pill badge is rendered to the right of
 * the strip ("FREEHF" etc.).
 */
export function ProductMarquee({
  text,
  couponCode,
  speed = "14s",
  backgroundColor = "#111111",
  textColor = "#ffffff",
  badgeBackgroundColor = "#ffffff",
  badgeTextColor = "#000000",
  href,
}: ProductMarqueeProps) {
  const animationId = "product-marquee-scroll";

  return (
    <>
      <style>{`
        @keyframes ${animationId} {
          from { transform: translateX(0); }
          to   { transform: translateX(-${TRANSLATE}); }
        }
        .product-marquee-strip {
          display: flex;
          width: max-content;
          white-space: nowrap;
          align-items: center;
          animation: ${animationId} ${speed} linear infinite;
          will-change: transform;
        }
      `}</style>

      <Link
        href={href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="product-marquee-container"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor,
          borderRadius: "8px",
          padding: "10px 18px",
          overflow: "hidden",
          gap: "12px",
          marginBottom: "32px",
          textDecoration: "none",
          cursor: href ? "pointer" : "default",
        }}
      >
        <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
          <div className="product-marquee-strip">
            {Array.from({ length: COPIES }, (_, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <span
                  style={{
                    color: textColor,
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {text}
                </span>
                <span
                  style={{
                    color: textColor,
                    fontSize: "13px",
                    margin: "0 16px",
                    opacity: 0.2,
                  }}
                >
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>

        {couponCode && (
          <span
            data-testid="product-marquee-coupon"
            style={{
              backgroundColor: badgeBackgroundColor,
              color: badgeTextColor,
              borderRadius: "20px",
              padding: "3px 13px",
              fontSize: "12px",
              fontWeight: 700,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {couponCode}
          </span>
        )}
      </Link>
    </>
  );
}
