import React from "react";

interface AccordionToggleIconProps {
  isOpen: boolean;
}

export const AccordionToggleIcon = ({ isOpen }: AccordionToggleIconProps) => {
  return (
    <div className="md:hidden text-white relative flex items-center justify-center size-[16px]">
      <span
        className={`absolute w-[16px] h-[2px] bg-current transition-transform duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />
      <span
        className={`absolute h-[16px] w-[2px] bg-current transition-all duration-300 ${
          isOpen ? "opacity-0 scale-y-0" : "opacity-100 scale-y-100"
        }`}
      />
    </div>
  );
};
