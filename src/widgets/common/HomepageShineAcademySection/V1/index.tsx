import Image from "next/image";
import { Box } from "@/ui/atomic";
import { HomepageShineAcademySectionProps } from "../types";

export function V1({ settings, className }: HomepageShineAcademySectionProps) {
  const { mobileSrc, desktopSrc, logoSrc, description } = settings;

  if (!logoSrc || !description) {
    return null;
  }

  return (
    <Box
      data-testid="homepage-shine-academy-container"
      className={`relative w-full ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(247, 240, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      {/* Desktop Layout */}
      <div
        data-testid="homepage-shine-academy-desktop-layout"
        className="hidden md:block"
      >
        <div
          data-testid="homepage-shine-academy-desktop-container"
          className="relative w-full px-4 pt-[5.6rem]"
        >
          {/* Logo Section */}
          <div
            data-testid="homepage-shine-academy-desktop-logo-section"
            className="flex justify-center mb-[1.8rem]"
          >
            <div
              data-testid="homepage-shine-academy-desktop-logo-wrapper"
              className="relative"
            >
              <Image
                src={logoSrc}
                alt="BBlunt Shine Academy Logo"
                width={336}
                height={137}
                className="object-contain"
              />
            </div>
          </div>

          {/* Description Text */}
          <div
            data-testid="homepage-shine-academy-desktop-description"
            className="relative z-0 flex justify-center mb-12"
          >
            <p
              data-testid="homepage-shine-academy-desktop-description-text"
              className="text-center font-medium text-primary text-[24px] max-w-[608px] leading-[105%]"
            >
              {description}
            </p>
          </div>

          {/* Desktop Gallery Image */}
          {desktopSrc && (
            <div
              data-testid="homepage-shine-academy-desktop-gallery-container"
              className="flex justify-center"
            >
              <div
                data-testid="homepage-shine-academy-desktop-gallery-wrapper"
                className="w-auto aspect-[1237/490] -mt-[6.5%]"
              >
                <Image
                  src={desktopSrc}
                  alt="Shine Academy Gallery"
                  width={1237}
                  height={490}
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        data-testid="homepage-shine-academy-mobile-layout"
        className="block md:hidden"
      >
        <div
          data-testid="homepage-shine-academy-mobile-container"
          className="relative w-full px-[16px] pt-[2.4rem]"
        >
          {/* Logo Section */}
          <div
            data-testid="homepage-shine-academy-mobile-logo-section"
            className="flex justify-center mb-[1.6rem]"
          >
            <div
              data-testid="homepage-shine-academy-mobile-logo-wrapper"
              className="relative"
            >
              <Image
                src={logoSrc}
                alt="BBlunt Shine Academy Logo"
                width={174}
                height={71}
                className="object-contain"
              />
            </div>
          </div>

          {/* Description Text */}
          <div
            data-testid="homepage-shine-academy-mobile-description"
            className="relative z-0 mb-[1.8rem]"
          >
            <p
              data-testid="homepage-shine-academy-mobile-description-text"
              className="text-center font-medium text-primary text-[12px] leading-[100%]"
            >
              {description}
            </p>
          </div>

          {/* Mobile Gallery Image */}
          {mobileSrc && (
            <div
              data-testid="homepage-shine-academy-mobile-gallery-container"
              className="flex justify-center"
            >
              <div
                data-testid="homepage-shine-academy-mobile-gallery-wrapper"
                className="relative w-auto aspect-[326/186]"
              >
                <Image
                  src={mobileSrc}
                  alt="Shine Academy Mobile Gallery"
                  width={326}
                  height={186}
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}
