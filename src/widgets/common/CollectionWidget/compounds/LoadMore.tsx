"use client";

import React from "react";

interface LoadMoreProps {
  onClick: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  className?: string;
  text?: string;
  loadingText?: string;
}

/**
 * Load more button component
 */
export function LoadMore({
  onClick,
  isLoading = false,
  hasMore = true,
  className = "",
  text = "Load More",
  loadingText = "Loading...",
}: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? loadingText : text}
    </button>
  );
}

export default LoadMore;
