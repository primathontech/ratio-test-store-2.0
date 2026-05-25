import Image from "next/image";
import React from "react";
import { SERVICE_ICON_SVGS } from "../constants";
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
      className={`py-4 ${className}`}
      data-testid="footer-service-sections-container"
    >
      <div
        className="flex justify-between items-center text-center"
        data-testid="footer-service-sections-wrapper"
      >
        {icons.map((section, index) => {
          const inlineSvg = SERVICE_ICON_SVGS[section.name];
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2"
              data-testid={`footer-service-section-${index}`}
            >
              <div
                className="mb-3 h-8 flex items-center justify-center"
                data-testid={`footer-service-section-icon-${index}`}
              >
                {inlineSvg
                  ? inlineSvg
                  : section.image && (
                      <Image
                        src={section.image}
                        alt={section.alt || section.name}
                        width={32}
                        height={32}
                        className="w-full aspect-square object-fill"
                        unoptimized
                        loading="lazy"
                      />
                    )}
              </div>
              <span
                className="text-sm text-white tracking-[0.08px] leading-[16.34px]"
                data-testid={`footer-service-section-name-${index}`}
              >
                {section.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
