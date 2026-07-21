"use client";

import React from "react";

export type PaginationPosition = "left" | "center" | "right";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  position?: PaginationPosition;
}

const positionClassMap: Record<PaginationPosition, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  position = "center",
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const justifyClass = positionClassMap[position];

  return (
    <div
      className={`w-full flex items-center flex-wrap gap-[11px] pt-[22px] md:pt-[30px] ${justifyClass}`}
      data-testid="pagination"
    >
      {currentPage > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors px-[22.6px] py-[19.5px] shine-link-button"
          aria-label="Previous page"
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
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`flex shine-link-button items-center justify-center min-w-9 h-9 px-[18.4px] py-[19.5px] rounded-full text-sm font-semibold transition-colors ${
            currentPage === page ? "bg-white text-black" : "bg-black text-white"
          }`}
          style={
            currentPage === page
              ? {
                  boxShadow:
                    "1px 1px 10px rgb(var(--color-overlay, 0 0 0) / 0.2)",
                }
              : undefined
          }
          aria-label={
            currentPage === page
              ? `Page ${page} (current)`
              : `Go to page ${page}`
          }
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center shine-link-button justify-center px-[22.6px] py-[19.5px] w-9 h-9 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
          aria-label="Next page"
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
