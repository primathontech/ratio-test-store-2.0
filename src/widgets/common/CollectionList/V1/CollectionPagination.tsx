"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

interface CollectionPaginationProps {
  currentPage: number;
  totalPages: number;
}

type PageItem = number | "...";

/**
 * Builds the page number sequence with ellipsis.
 *
 * Examples (totalPages=17):
 *   page 1  → [1, 2, 3, "...", 17]
 *   page 4  → [1, 2, 3, 4, 5, 6, "...", 17]
 *   page 5  → [1, "...", 3, 4, 5, 6, 7, "...", 17]
 *   page 14 → [1, "...", 12, 13, 14, 15, 16, 17]
 */
function buildPages(current: number, total: number): PageItem[] {
  if (total <= 1) {
    return [1];
  }

  const delta = 2;
  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  const items: PageItem[] = [1];

  if (rangeStart > 2) {
    items.push("...");
  }

  for (let p = rangeStart; p <= rangeEnd; p++) {
    items.push(p);
  }

  if (rangeEnd < total - 1) {
    items.push("...");
  }

  items.push(total);

  return items;
}

const btnBase =
  "flex items-center justify-center min-w-9 h-9 px-[18.4px] py-[19.5px] rounded-[10px] text-base font-semibold transition-colors shine-link-button";

const navBase =
  "flex items-center justify-center w-9 h-9 rounded-[10px] bg-secondary text-black transition-colors px-[22.6px] py-[19.5px] border border-[#ebebeb] shine-link-button";

export const CollectionPagination: React.FC<CollectionPaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      router.push(`${pathname}${params.size ? `?${params}` : ""}`, {
        scroll: false,
      });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [pathname, router, searchParams]
  );

  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPages(currentPage, totalPages);

  return (
    <div
      className="w-full flex items-center justify-center flex-wrap gap-[11px] pt-[22px] md:pt-[30px]"
      data-testid="collection-pagination"
    >
      {currentPage > 1 && (
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => handlePageChange(currentPage - 1)}
          className={navBase}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="11"
            viewBox="0 0 7 11"
            className="shrink-0"
          >
            <path
              d="M6.02344 0L0.523438 5.5L6.02344 11L6.99969 10.0237L2.47594 5.5L6.99969 0.97625L6.02344 0Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {pages.map((item, i) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${i}`}
              className="flex items-center justify-center w-9 h-9 text-base font-semibold text-primary select-none"
            >
              …
            </span>
          );
        }

        const isCurrent = item === currentPage;

        return (
          <button
            key={item}
            type="button"
            aria-label={
              isCurrent ? `Page ${item} (current)` : `Go to page ${item}`
            }
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => !isCurrent && handlePageChange(item)}
            style={
              isCurrent
                ? {
                    boxShadow:
                      "1px 1px 10px rgb(var(--color-overlay, 0 0 0) / 0.2)",
                  }
                : undefined
            }
            className={`${btnBase} border border-[#ebebeb] ${
              isCurrent ? "bg-black text-white" : "bg-secondary text-black"
            }`}
          >
            {item}
          </button>
        );
      })}

      {currentPage < totalPages && (
        <button
          type="button"
          aria-label="Next page"
          onClick={() => handlePageChange(currentPage + 1)}
          className={navBase}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="11"
            viewBox="0 0 7 11"
            className="shrink-0 rotate-180"
          >
            <path
              d="M6.02344 0L0.523438 5.5L6.02344 11L6.99969 10.0237L2.47594 5.5L6.99969 0.97625L6.02344 0Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
