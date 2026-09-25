"use client";

import React, { memo, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryTabBarProps, CategoryPillItem } from "../types";
import "../style.css";

export const V1 = memo(function V1({ data, className }: CategoryTabBarProps) {
  const pathname = usePathname();
  const rawData = data as Record<string, unknown> | undefined;
  const apiCollections = Array.isArray((rawData as any)?.data)
    ? ((rawData as any).data as Array<Record<string, any>>)
    : null;

  // Current collection handle from URL
  const currentHandle = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) ?? [];
    return segments[segments.length - 1] || "";
  }, [pathname]);

  // Build pill items from the current collection's `subcollections` metafield
  const categories = useMemo((): CategoryPillItem[] => {
    if (!apiCollections || apiCollections.length === 0) {
      return [];
    }

    const collectionByHandle = new Map(
      apiCollections.map((c) => [c.handle, c])
    );

    const currentCol = collectionByHandle.get(currentHandle);
    const subs = currentCol?.metadata?.subcollections?.value;
    if (!Array.isArray(subs)) {
      return [];
    }

    return subs
      .map((sub: { handle?: string }) => {
        if (!sub?.handle) {
          return null;
        }
        const childCol = collectionByHandle.get(sub.handle);
        return {
          label: childCol?.title ?? sub.handle,
          href: `/collections/${sub.handle}`,
        } as CategoryPillItem;
      })
      .filter((x): x is CategoryPillItem => x !== null);
  }, [apiCollections, currentHandle]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // On mount, scroll the active pill into view on mobile
  useEffect(() => {
    if (!currentHandle || !scrollRef.current) {
      return;
    }
    const activeEl = scrollRef.current.querySelector(
      "[data-active='true']"
    ) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentHandle]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <nav
      className={`nintara-ctb ${className ?? ""}`}
      aria-label="Collection categories"
    >
      <div className="nintara-ctb__scroll" ref={scrollRef}>
        {categories.map((cat) => {
          const handle = cat.href.split("/").filter(Boolean).pop() || "";
          const active = handle === currentHandle;
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`nintara-ctb__pill${active ? " nintara-ctb__pill--active" : ""}`}
              data-active={active ? "true" : undefined}
              aria-current={active ? "page" : undefined}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

export { V1 as default };
