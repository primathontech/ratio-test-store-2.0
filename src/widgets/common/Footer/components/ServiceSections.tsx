import Image from "next/image";
import React from "react";
import { ServiceIconItem } from "../types";

interface ServiceSectionsProps {
  icons: ServiceIconItem[];
  className?: string;
}

export const ServiceSections: React.FC<ServiceSectionsProps> = ({
  icons,
  className = "",
}) => {
  if (icons.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="footer-service-sections-container"
      className={`py-6 ${className}`}
    >
      <div
        data-testid="footer-service-sections-wrapper"
        className="flex justify-between items-center text-center"
      >
        {icons.map((section, index) => (
          <div
            key={index}
            data-testid={`footer-service-section-${index}`}
            className="flex flex-col items-center"
          >
            <div
              data-testid={`footer-service-section-icon-${index}`}
              className="mb-3 size-[32px] flex items-center justify-center"
            >
              <Image
                src={section.image}
                alt={section.name}
                width={32}
                height={32}
                className="w-full aspect-square object-fill"
                unoptimized
              />
            </div>
            <span
              data-testid={`footer-service-section-name-${index}`}
              className="text-text-sm text-white tracking-[0.08px] leading-[16.34px]"
            >
              {section.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
