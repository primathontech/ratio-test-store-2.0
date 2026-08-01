"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileBottomBarProps } from "../types";
import "../style.css";

/**
 * MobileBottomBar V1 — Fixed bottom navigation bar on mobile
 *
 * Three items: Home, Our Products, About Us
 * Matches nintarababy.in mobile toolbar:
 * - 55px height, white bg, box-shadow
 * - Hidden on desktop (>= 768px)
 * - Active item gets teal color (#01464f)
 */
export function V1({ className }: MobileBottomBarProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isProducts = pathname.startsWith("/collections");
  const isAbout = pathname === "/about-us";

  if (pathname === "/orders") {
    return null;
  }

  return (
    <nav
      className={`nintara-mobile-bar ${className ?? ""}`}
      aria-label="Mobile navigation"
      data-testid="momsco-mobile-bottom-bar"
    >
      {/* Home */}
      <Link
        href="/"
        className={`nintara-mobile-bar__item${isHome ? " nintara-mobile-bar__item--active" : ""}`}
      >
        <span className="nintara-mobile-bar__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.85139 13.2135C2.49837 10.9162 2.32186 9.76763 2.75617 8.74938C3.19047 7.73112 4.15403 7.03443 6.08114 5.64106L7.52099 4.6C9.91829 2.86667 11.1169 2 12.5 2C13.8831 2 15.0817 2.86667 17.479 4.6L18.9189 5.64106C20.846 7.03443 21.8095 7.73112 22.2438 8.74938C22.6781 9.76763 22.5016 10.9162 22.1486 13.2135L21.8476 15.1724C21.3471 18.4289 21.0969 20.0572 19.929 21.0286C18.7611 22 17.0537 22 13.639 22H11.361C7.9463 22 6.23893 22 5.07104 21.0286C3.90315 20.0572 3.6529 18.4289 3.15241 15.1724L2.85139 13.2135Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9.5 18H15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="nintara-mobile-bar__label">Home</span>
      </Link>

      {/* Our Products */}
      <Link
        href="/collections/shop-all"
        className={`nintara-mobile-bar__item${isProducts ? " nintara-mobile-bar__item--active" : ""}`}
      >
        <span className="nintara-mobile-bar__icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4.38809 9.26285C4.74282 7.37096 6.39472 6 8.31958 6H15.6802C17.605 6 19.2569 7.37095 19.6117 9.26285L21.1117 17.2628C21.5732 19.7245 19.6847 22 17.1802 22H6.81958C4.31502 22 2.42653 19.7245 2.88809 17.2628L4.38809 9.26285Z"
              fill="currentColor"
            />
            <path
              d="M15.9999 6C15.9999 3.79086 14.209 2 11.9999 2C9.79073 2 7.99987 3.79086 7.99987 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="nintara-mobile-bar__label">Our Products</span>
      </Link>

      {/* About Us */}
      <Link
        href="/about-us"
        className={`nintara-mobile-bar__item${isAbout ? " nintara-mobile-bar__item--active" : ""}`}
      >
        <span className="nintara-mobile-bar__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <g clipPath="url(#about-clip)">
              <path
                d="M19.9738 9.86925C19.7694 9.09684 18.1641 7.94259 16.2663 7.40547C17.2256 5.68115 17.547 3.73097 17.1456 3.0399C17.1188 2.99486 17.0972 2.95788 17.0697 2.92898C17.0401 2.90343 17.0038 2.88058 16.9588 2.85503C16.2677 2.45235 14.3175 2.77302 12.5939 3.73298C12.0567 1.83523 10.9025 0.229908 10.1301 0.0255454C10.0817 0.0121005 10.0387 0.00201674 9.99966 0C9.95929 0.00168008 9.91726 0.0121005 9.86883 0.0255454C9.09643 0.229908 7.94218 1.83523 7.40506 3.73298C5.68074 2.77302 3.73056 2.45235 3.03949 2.85503C2.99445 2.88058 2.95747 2.90343 2.92857 2.92898C2.90302 2.95788 2.88018 2.99486 2.85462 3.0399C2.45195 3.73097 2.77261 5.68115 3.73257 7.40547C1.83482 7.94259 0.229496 9.09684 0.0251339 9.86925C0.0116889 9.91768 0.00160515 9.96037 0 10C0.00160515 10.0397 0.0116889 10.0823 0.0251339 10.1301C0.229496 10.9025 1.83482 12.0567 3.73257 12.5939C2.77261 14.3182 2.45195 16.2684 2.85462 16.9594C2.88018 17.0045 2.90302 17.0415 2.92857 17.0704C2.95747 17.0959 2.99445 17.1187 3.03949 17.1443C3.73056 17.547 5.68074 17.2263 7.40506 16.2664C7.94218 18.1641 9.09643 19.7694 9.86883 19.9738C9.91726 19.9872 9.95929 19.9973 9.99966 19.9993C10.0387 19.9976 10.0817 19.9872 10.1301 19.9738C10.9025 19.7694 12.0567 18.1641 12.5939 16.2664C14.3175 17.2263 16.2677 17.547 16.9588 17.1443C17.0038 17.1187 17.0401 17.0959 17.0697 17.0704C17.0972 17.0415 17.1188 17.0045 17.1456 16.9594C17.547 16.2684 17.2256 14.3182 16.2663 12.5939C18.1641 12.0567 19.7694 10.9025 19.9738 10.1301C19.9872 10.0823 19.9973 10.0397 19.9993 10C19.9976 9.96037 19.9872 9.91768 19.9738 9.86925Z"
                fill="currentColor"
                fillOpacity="0.15"
                stroke="currentColor"
                strokeWidth="0.8"
              />
              <circle cx="10" cy="10" r="3" fill="currentColor" />
            </g>
            <defs>
              <clipPath id="about-clip">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
        <span className="nintara-mobile-bar__label">About Us</span>
      </Link>
    </nav>
  );
}

export { V1 as default };
