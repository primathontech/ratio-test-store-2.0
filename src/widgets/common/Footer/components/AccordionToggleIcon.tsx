import React from "react";

interface AccordionToggleIconProps {
  isOpen: boolean;
}

export const AccordionToggleIcon = ({ isOpen }: AccordionToggleIconProps) => {
  return (
    <div
      data-testid={`accordion-toggle-icon-${isOpen ? "open" : "closed"}`}
      className="md:hidden text-white relative flex items-center justify-center size-[16px]"
    >
      {/* Horizontal Line */}
      <span
        data-testid={`accordion-toggle-icon-horizontal-${isOpen ? "open" : "closed"}`}
        className={`absolute w-[16px] h-[2px] bg-current transition-transform duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />

      {/* Vertical Line */}
      <span
        data-testid={`accordion-toggle-icon-vertical-${isOpen ? "open" : "closed"}`}
        className={`absolute h-[16px] w-[2px] bg-current transition-all duration-300 ${
          isOpen ? "opacity-0 scale-y-0" : "opacity-100 scale-y-100"
        }`}
      />
    </div>
  );
};
