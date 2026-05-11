import React from "react";

interface AccordionToggleIconProps {
  isOpen: boolean;
}

export const AccordionToggleIcon = ({ isOpen }: AccordionToggleIconProps) => {
  return (
    <div
      className="md:hidden text-white relative flex items-center justify-center size-4"
      data-testid={`accordion-toggle-icon-${isOpen ? "open" : "closed"}`}
    >
      <span
        className={`absolute w-4 h-0.5 bg-current transition-transform duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
        data-testid={`accordion-toggle-icon-horizontal-${isOpen ? "open" : "closed"}`}
      />
      <span
        className={`absolute h-4 w-0.5 bg-current transition-all duration-300 ${
          isOpen ? "opacity-0 scale-y-0" : "opacity-100 scale-y-100"
        }`}
        data-testid={`accordion-toggle-icon-vertical-${isOpen ? "open" : "closed"}`}
      />
    </div>
  );
};
