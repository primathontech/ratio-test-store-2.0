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
    <div className={`py-4 ${className}`}>
      <div className="flex justify-between items-center text-center">
        {icons.map((section, index) => {
          const inlineSvg = SERVICE_ICON_SVGS[section.name];
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="mb-3 h-8 flex items-center justify-center">
                {inlineSvg
                  ? inlineSvg
                  : section.image && (
                      <Image
                        src={section.image}
                        alt={section.name}
                        width={32}
                        height={32}
                        className="w-full aspect-square object-fill"
                        unoptimized
                        loading="lazy"
                      />
                    )}
              </div>
              <span className="text-sm text-white tracking-[0.08px] leading-[16.34px]">
                {section.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
