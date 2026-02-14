import Image from "next/image";
import { ReasonToLoveSectionProps } from "../types";
import { Box } from "@/ui/atomic";
import productData from "../../ProductGalleryWithInfo/data/product.json";

export const REASON_TO_LOVE_IMAGE_METAFIELD_KEY = "reasons_to_love_image";

export function V1({ data, settings, className }: ReasonToLoveSectionProps) {
  // TODO: This will be uncommented when the real data comes in
  const product = data?.data;

  if (!product) {
    return null;
  }

  const { metadata } = product || {};

  const { sectionTitle } = settings;

  // Find Product detail metafield
  const reasonToLoveImage =
    metadata?.[REASON_TO_LOVE_IMAGE_METAFIELD_KEY]?.value;

  const reasonToLoveImageUrl = reasonToLoveImage?.[0];

  if (!reasonToLoveImageUrl) {
    return null;
  }

  return (
    <div
      data-testid="reason-to-love-section-container"
      className={`w-full flex items-center rounded-3xl overflow-hidden lg:px-8 justify-center  ${className || ""}`}
    >
      <div
        data-testid="reason-to-love-section-inner-container"
        className="flex flex-col w-full px-[15px] md:px-[30px] lg:px-0  pb-[21px]  md:py-[23.8px] lg:py-[28px] md:mb-[140px] "
      >
        <div
          data-testid="reason-to-love-section-content-wrapper"
          className="w-full flex justify-center"
        >
          <div
            data-testid="reason-to-love-section-image-container"
            className={`w-full md:w-[1237px] rounded-2xl overflow-hidden`}
          >
            {/* Left aligned title */}
            <p className="text-left text-[16px] md:text-[22px] lg:text-[24px] font-bold text-black mb-8">
              {sectionTitle}
            </p>

            {reasonToLoveImageUrl && (
              <Image
                src={reasonToLoveImageUrl}
                alt={reasonToLoveImageUrl || sectionTitle}
                unoptimized
                width={1237}
                height={4200}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 1237px"
                className="object-cover rounded-2xl w-full h-auto"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
