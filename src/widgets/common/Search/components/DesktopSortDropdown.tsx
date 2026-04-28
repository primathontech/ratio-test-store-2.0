"use client";

import React, { useState } from "react";
import { Box, Text, Flex } from "@/ui/atomic";
import { SORT_OPTIONS } from "../constants/search-constants";

interface DesktopSortDropdownProps {
  className?: string;
  selectedSort?: string;
  onSortChange?: (sortId: string) => void;
  showSortOnly?: boolean;
}

const DesktopSortDropdown: React.FC<DesktopSortDropdownProps> = ({
  className = "",
  selectedSort = "relevance",
  onSortChange,
  showSortOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = () => setIsOpen(!isOpen);

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    setIsOpen(false);
    if (onSortChange) {
      onSortChange(value);
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  const getCurrentSortLabel = () => {
    const currentOption = SORT_OPTIONS.find(
      (option) => option.value === selectedSort
    );
    return currentOption ? currentOption.label : "Relevance";
  };

  return (
    <Box className={`relative ${className}`}>
      <Flex className="items-center gap-4">
        <div className={showSortOnly ? "relative" : "relative min-w-[200px]"}>
          <button
            onClick={onToggle}
            disabled={isLoading}
            className={
              showSortOnly
                ? "flex items-center gap-2 px-[8px] py-[6px] border border-gray-300 rounded-[10px] bg-white"
                : "w-full flex items-center justify-between pl-[18px] pr-[25px] py-[10px] border border-gray-300 bg-white transition-colors duration-200 disabled:opacity-50 text-left rounded-[10px] min-w-[217px] hover:border-black focus:border-black mt-2"
            }
          >
            <Text
              className={
                showSortOnly
                  ? "!text-[12px] !font-medium !text-black"
                  : "!text-black font-normal !text-[14px]"
              }
            >
              {showSortOnly ? "Sort" : getCurrentSortLabel()}
            </Text>
            <svg viewBox="0 0 600 500" width="12" height="12" fill="#000">
              <path d="m275.565 361.679-223.897-223.896h-51.668l275.565 275.565 275.565-275.565h-51.668z" />
            </svg>
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onToggle} />

              <div
                className={
                  showSortOnly
                    ? "absolute top-full right-0 bg-white border border-gray-300 z-[100] overflow-hidden w-[150px]"
                    : "absolute top-full left-0 right-0 bg-white border border-black focus:border-black z-[100] overflow-hidden"
                }
              >
                <div className="overflow-y-auto">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left text-sm px-2 py-1 transition-colors duration-150 ${
                        selectedSort === option.value
                          ? "bg-loading-blue font-medium !text-white"
                          : "text-black font-normal hover:bg-gray-100"
                      }`}
                    >
                      <Flex className="items-center justify-between">
                        <Text
                          className={
                            selectedSort === option.value
                              ? "!text-white !text-[14px]"
                              : "!text-black !text-[14px]"
                          }
                        >
                          {option.label}
                        </Text>
                      </Flex>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Flex>
    </Box>
  );
};

export default DesktopSortDropdown;
