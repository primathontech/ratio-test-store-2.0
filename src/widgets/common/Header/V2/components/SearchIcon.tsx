import React from "react";
import Image from "next/image";

interface SearchIconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
  width = "16",
  height = "16",
  className = "",
  style,
}) => {
  const numericWidth =
    typeof width === "string" ? Number(width) : (width ?? 16);
  const numericHeight =
    typeof height === "string" ? Number(height) : (height ?? 16);

  return (
    <Image
      src="/dawn/images/static/search_icon.svg"
      alt="Search"
      width={numericWidth}
      height={numericHeight}
      className={className}
      style={style}
      aria-hidden="true"
      unoptimized
    />
  );
};
