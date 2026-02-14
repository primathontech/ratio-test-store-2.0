import Image from "next/image";
import React from "react";

interface BackgroundImageProps {
  sectionBackgroundDesktopImage: string;
  sectionBackgroundMobileImage: string;
}

export const BackgroundImage = ({
  sectionBackgroundDesktopImage,
  sectionBackgroundMobileImage,
}: BackgroundImageProps) => {
  return (
    <div>
      {/* Background Image For Mobile */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src={sectionBackgroundMobileImage}
          alt="Section background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Background Image For Desktop */}
      <div className="absolute inset-0 hidden md:flex justify-center">
        <Image
          src={sectionBackgroundDesktopImage}
          alt="Section background"
          width={1329}
          height={656}
          className="object-cover"
          priority={false}
        />
      </div>
    </div>
  );
};
