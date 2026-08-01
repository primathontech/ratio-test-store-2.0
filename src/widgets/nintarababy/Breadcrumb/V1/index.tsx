"use client";

import React, { useState } from "react";
import {
  BreadcrumbProps,
  CHEVRON_SVG_PATH,
  DEFAULT_BREADCRUMB_ITEMS,
} from "../types";
import "../style.css";

/**
 * ChevronSeparator — inline SVG chevron right arrow
 * Matches the source: viewBox 0 0 32 32, 10px wide, fill currentColor,
 * positioned 4px down via relative top for vertical alignment.
 */
function ChevronSeparator() {
  return (
    <svg
      className="nintara-breadcrumb__separator"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={CHEVRON_SVG_PATH} />
    </svg>
  );
}

/**
 * Breadcrumb V1 Component
 *
 * Minimal breadcrumb navigation cloned from nintarababy.in product page.
 * Warm cream background (#f5ead3), Figtree 12px font, chevron separator.
 *
 * Features:
 * - Home link with hover underline + subtle color shift
 * - Chevron SVG separator
 * - Current page span at 0.6 opacity
 * - Mobile truncation with ellipsis at max-width 200px
 * - Responsive horizontal padding (90px desktop, 32px small mobile)
 */
function MobileShareButton() {
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  return (
    <div
      className="nintara-breadcrumb__share-mobile"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="nintara-pm__share-btn nintara-pm__share-btn--toggle"
        aria-label="Share"
        onClick={() =>
          setShareOpen((prev) => {
            if (!prev) {
              setTimeout(() => setShareOpen(false), 5000);
            }
            return !prev;
          })
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="31"
          viewBox="0 0 34 31"
          fill="none"
        >
          <path
            d="M23 10.5C23.7745 10.6606 24.3588 10.9286 24.8284 11.3759C26 12.4918 26 14.2879 26 17.88C26 21.4721 26 23.2681 24.8284 24.3841C23.6569 25.5 21.7712 25.5 18 25.5H16C12.2288 25.5 10.3431 25.5 9.17157 24.3841C8 23.2681 8 21.4721 8 17.88C8 14.2879 8 12.4918 9.17157 11.3759C9.64118 10.9286 10.2255 10.6606 11 10.5"
            stroke="#092A33"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17.0253 5.50052L17 17.5M17.0253 5.50052C16.8627 5.49379 16.6991 5.55191 16.5533 5.67492C15.6469 6.44006 14 8.42886 14 8.42886M17.0253 5.50052C17.1711 5.50657 17.3162 5.56476 17.4468 5.67508C18.3531 6.44037 20 8.42886 20 8.42886"
            stroke="#092A33"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`nintara-pm__share-dropdown${shareOpen ? " is-open" : ""}`}
      >
        <button
          className="nintara-pm__share-btn"
          aria-label="Share on Facebook"
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
              "_blank"
            )
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.75974 7.25C4.13118 7.25 4 7.37087 4 7.95V9C4 9.57913 4.13118 9.7 4.75974 9.7H6.27922V13.9C6.27922 14.4791 6.4104 14.6 7.03896 14.6H8.55844C9.187 14.6 9.31818 14.4791 9.31818 13.9V9.7H11.0243C11.501 9.7 11.6239 9.61463 11.7548 9.1923L12.0804 8.14231C12.3048 7.41886 12.1665 7.25 11.3499 7.25H9.31818V5.5C9.31818 5.1134 9.65833 4.8 10.0779 4.8H12.2403C12.8688 4.8 13 4.67913 13 4.1V2.7C13 2.12087 12.8688 2 12.2403 2H10.0779C7.97996 2 6.27922 3.567 6.27922 5.5V7.25H4.75974Z"
              stroke="#092A33"
              strokeWidth="1.125"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="nintara-pm__share-btn"
          aria-label="Share on Instagram"
          onClick={() =>
            window.open("https://www.instagram.com/themomsco", "_blank")
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.6667 2.16174H5.33333C3.49239 2.16174 2 3.65413 2 5.49508V10.8284C2 12.6693 3.49239 14.1617 5.33333 14.1617H10.6667C12.5076 14.1617 14 12.6693 14 10.8284V5.49508C14 3.65413 12.5076 2.16174 10.6667 2.16174ZM12.8333 10.8284C12.8297 12.0235 11.8617 12.9914 10.6667 12.9951H5.33333C4.13823 12.9914 3.17033 12.0235 3.16667 10.8284V5.49508C3.17033 4.29998 4.13823 3.33207 5.33333 3.32841H10.6667C11.8617 3.33207 12.8297 4.29998 12.8333 5.49508V10.8284ZM11.1667 5.66174C11.5349 5.66174 11.8333 5.36326 11.8333 4.99508C11.8333 4.62689 11.5349 4.32841 11.1667 4.32841C10.7985 4.32841 10.5 4.62689 10.5 4.99508C10.5 5.36326 10.7985 5.66174 11.1667 5.66174ZM8 5.16174C6.34315 5.16174 5 6.50489 5 8.16174C5 9.81861 6.34315 11.1617 8 11.1617C9.65687 11.1617 11 9.81861 11 8.16174C11.0018 7.36554 10.6863 6.60146 10.1233 6.03846C9.56027 5.47547 8.7962 5.15997 8 5.16174ZM6.16667 8.16174C6.16667 9.17428 6.98747 9.99508 8 9.99508C9.01253 9.99508 9.83333 9.17428 9.83333 8.16174C9.83333 7.14921 9.01253 6.32841 8 6.32841C6.98747 6.32841 6.16667 7.14921 6.16667 8.16174Z"
              fill="#092A33"
            />
          </svg>
        </button>
        <button
          className="nintara-pm__share-btn"
          aria-label="Share on WhatsApp"
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
              "_blank"
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g clipPath="url(#clip0_bc_wa)">
              <path
                d="M8.00065 14.6667C11.6826 14.6667 14.6673 11.6819 14.6673 8.00001C14.6673 4.31811 11.6826 1.33334 8.00065 1.33334C4.31875 1.33334 1.33398 4.31811 1.33398 8.00001C1.33398 8.91925 1.52003 9.79504 1.85653 10.5918C2.0425 11.0321 2.13549 11.2523 2.147 11.4187C2.15852 11.5851 2.10954 11.7681 2.0116 12.1342L1.33398 14.6667L3.8665 13.9891C4.23257 13.8911 4.41561 13.8421 4.582 13.8537C4.74839 13.8652 4.96855 13.9582 5.40888 14.1441C6.20562 14.4806 7.08141 14.6667 8.00065 14.6667Z"
                stroke="#092A33"
                strokeLinejoin="round"
              />
              <path
                d="M5.72576 8.25156L6.30639 7.53043C6.5511 7.2265 6.85362 6.94353 6.8773 6.53884C6.88328 6.43663 6.81136 5.97772 6.66752 5.05991C6.611 4.69921 6.27423 4.66667 5.98254 4.66667C5.60242 4.66667 5.41236 4.66667 5.22363 4.75288C4.98509 4.86184 4.74018 5.16821 4.68644 5.42489C4.64392 5.62798 4.67552 5.76792 4.73872 6.0478C5.00714 7.23655 5.63687 8.41057 6.61331 9.38702C7.58976 10.3635 8.76378 10.9932 9.95253 11.2616C10.2324 11.3248 10.3723 11.3564 10.5754 11.3139C10.8321 11.2601 11.1385 11.0152 11.2474 10.7767C11.3337 10.588 11.3337 10.3979 11.3337 10.0178C11.3337 9.7261 11.3011 9.38933 10.9404 9.33281C10.0226 9.18897 9.5637 9.11705 9.46149 9.12303C9.0568 9.14671 8.77383 9.44923 8.4699 9.69395L7.74877 10.2746"
                stroke="#092A33"
              />
            </g>
            <defs>
              <clipPath id="clip0_bc_wa">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        <button
          className="nintara-pm__share-btn"
          aria-label="Copy link"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => {
              setCopiedLink(false);
              setShareOpen(false);
            }, 1500);
          }}
        >
          {copiedLink ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3d7cc9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clipPath="url(#clip0_bc_copy)">
                <path
                  d="M6.00098 10C6.00098 8.11438 6.00098 7.17157 6.58676 6.58578C7.17255 6 8.11536 6 10.001 6L10.6676 6C12.5533 6 13.4961 6 14.0819 6.58578C14.6676 7.17157 14.6676 8.11438 14.6676 10V10.6667C14.6676 12.5523 14.6676 13.4951 14.0819 14.0809C13.4961 14.6667 12.5533 14.6667 10.6676 14.6667H10.001C8.11536 14.6667 7.17255 14.6667 6.58676 14.0809C6.00098 13.4951 6.00098 12.5523 6.00098 10.6667L6.00098 10Z"
                  stroke="#092A33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.3339 6C11.3323 4.0286 11.3025 3.00747 10.7287 2.30828C10.6179 2.17326 10.4941 2.04945 10.359 1.93863C9.62147 1.33333 8.52564 1.33333 6.33399 1.33333C4.14233 1.33333 3.0465 1.33333 2.30894 1.93863C2.17391 2.04944 2.0501 2.17326 1.93929 2.30828C1.33398 3.04585 1.33398 4.14167 1.33398 6.33333C1.33398 8.52498 1.33398 9.62081 1.93929 10.3584C2.0501 10.4934 2.17391 10.6172 2.30894 10.728C3.00812 11.3018 4.02926 11.3317 6.00065 11.3332"
                  stroke="#092A33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_bc_copy">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export function V1({ data, className }: BreadcrumbProps) {
  const rawData = data as any;
  const productTitle = rawData?.data?.title || rawData?.title;

  const items = productTitle
    ? [{ label: "Home", href: "/" }, { label: productTitle }]
    : (data?.items ?? DEFAULT_BREADCRUMB_ITEMS);

  return (
    <section
      className={`nintara-breadcrumb ${className ?? ""}`}
      aria-label="Breadcrumb"
      data-testid="momsco-product-breadcrumb"
    >
      <div className="nintara-breadcrumb__wrap">
        <div className="nintara-breadcrumb__container">
          <div className="nintara-breadcrumb__row">
            <div className="nintara-breadcrumb__col">
              <nav className="nintara-breadcrumb__nav" aria-label="Breadcrumb">
                {items.map((item, index) => {
                  const isLast = index === items.length - 1;

                  if (isLast || !item.href) {
                    return (
                      <span
                        key={item.label}
                        className="nintara-breadcrumb__current"
                        aria-current="page"
                      >
                        {item.label}
                      </span>
                    );
                  }

                  return (
                    <React.Fragment key={item.label}>
                      <a
                        href={item.href}
                        className="nintara-breadcrumb__link"
                        data-testid={
                          item.href === "/"
                            ? "momsco-product-breadcrumb-home"
                            : undefined
                        }
                      >
                        {item.label}
                      </a>
                      <ChevronSeparator />
                    </React.Fragment>
                  );
                })}
              </nav>
            </div>
            <MobileShareButton />
          </div>
        </div>
      </div>
    </section>
  );
}

export { V1 as default };
