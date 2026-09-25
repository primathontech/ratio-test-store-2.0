"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollectionHeaderProps, DEFAULT_CONTENT } from "../types";
import "../style.css";

/* =====================================================================
   V1 — Collection Header with breadcrumb, H1 heading, and subtitle

   Source: nintarababy.in/collections/all-products
   Selector: #shopify-section-template--24784209412402__heading_template

   Layout:
   - White background with 54% overlay pseudo-element
   - 1200px centered container with 15px horizontal padding
   - Breadcrumb: Home > Shop All (SVG chevron separator, 9x9px)
   - H1: 37px/600 desktop, 18px/600 mobile, centered
   - Subtitle: 14px/400, centered
   - Section padding: 20px desktop, 15px mobile

   Interactions:
   - Breadcrumb items: hover opacity 0.8, 0.25s ease transition
   ===================================================================== */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: CollectionHeaderProps) {
  const pathname = usePathname();
  const rawData = data as Record<string, unknown> | undefined;
  const apiCollections = Array.isArray((rawData as any)?.data)
    ? ((rawData as any).data as Array<Record<string, any>>)
    : null;

  // Find the current collection by matching URL handle, fall back to "shop-all" for invalid slugs
  const FALLBACK_HANDLE = "shop-all";
  const currentCollection = useMemo(() => {
    if (!apiCollections) {
      return null;
    }
    const segments = pathname?.split("/") ?? [];
    const handle = segments[segments.length - 1];
    const match = apiCollections.find((c) => c.handle === handle);
    if (match) {
      return match;
    }
    // Invalid slug — fall back to shop-all collection
    return apiCollections.find((c) => c.handle === FALLBACK_HANDLE) ?? null;
  }, [apiCollections, pathname]);

  const colData = currentCollection?.data ?? currentCollection;
  const heading =
    colData?.title ??
    data?.heading ??
    settings?.heading ??
    DEFAULT_CONTENT.heading;

  const breadcrumbs = currentCollection
    ? [
        { text: "Home", href: "/" },
        { text: colData?.title ?? heading, current: true },
      ]
    : (data?.breadcrumbs ?? DEFAULT_CONTENT.breadcrumbs);

  return (
    <section
      className={`nintara-ch ${className ?? ""}`}
      aria-label="Collection header"
    >
      <div className="nintara-ch__inner">
        <div className="nintara-ch__container">
          {/* Breadcrumb navigation */}
          <nav
            className="nintara-ch__breadcrumbs"
            role="navigation"
            aria-label="breadcrumbs"
            data-testid="momsco-collection-breadcrumbs"
          >
            <ul className="nintara-ch__breadcrumb-list">
              {breadcrumbs.map((item, index) => (
                <li
                  key={item.text}
                  className="nintara-ch__breadcrumb-item"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.href && !item.current ? (
                    <Link
                      href={item.href}
                      className="nintara-ch__breadcrumb-link"
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <span className="nintara-ch__breadcrumb-text">
                      {item.text}
                    </span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <svg
                      className="nintara-ch__breadcrumb-arrow"
                      viewBox="0 0 100 100"
                      aria-hidden="true"
                    >
                      <path
                        d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z"
                        transform="translate(100, 100) rotate(180)"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* H1 heading */}
          <h1
            className="nintara-ch__title"
            data-testid="momsco-collection-title"
          >
            {heading}
          </h1>

          {/* Subtitle */}
          {/* <p className="nintara-ch__subtitle">{subtitle}</p> */}
        </div>
      </div>
    </section>
  );
});

export { V1 as default };
