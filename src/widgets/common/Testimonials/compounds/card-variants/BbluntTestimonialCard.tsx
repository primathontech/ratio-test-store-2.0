import React from "react";
import Image from "next/image";
import { CardVariantProps } from "@/widgets/common/Testimonials/compounds/card-variants/types";

/**
 * Custom testimonial card for BBLUNT brand
 * Uses pseudo-element approach for speech bubble effect - fully responsive
 */
export const BbluntTestimonialCard: React.FC<CardVariantProps> = ({
  testimonial,
  styleConfig = {},
}) => {
  const { image, name, stars, title, description, alt } = testimonial;

  const {
    backgroundColor = "#000000",
    textColors = {
      name: "#000000",
      title: "#ffffff",
      description: "#ffffff",
    },
    starColor = "#FFC300",
    starEmptyColor = "#4A4A4A",
  } = styleConfig;

  const renderStars = () => {
    return (
      <div className="flex gap-1" aria-label={`${stars} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="size-[14px]"
            style={{ color: i < stars ? starColor : starEmptyColor }}
            fill="currentColor"
            viewBox="0 0 15 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.09251 0L9.06504 4.68253L14.185 5.08779L10.2841 8.38701L11.4759 13.32L7.09251 10.6765L2.7091 13.32L3.90088 8.38701L0 5.08779L5.11997 4.68253L7.09251 0Z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* Main card wrapper for speech bubble effect */}
      <div className="relative">
        {/* Black background card */}
        <div
          className="relative w-full p-[1.6rem] md:p-[2.4rem] rounded-[4px] rounded-bl-none"
          style={{
            backgroundColor,
          }}
        >
          {/* Review Title */}
          <h4
            className="font-bold text-text-base md:text-[20px] mb-[1.6rem]"
            style={{ color: textColors.title }}
          >
            {title}
          </h4>

          {/* Review Description */}
          <p
            className="text-text-sm md:text-text-base leading-tight !font-normal mb-[2.6rem]"
            style={{ color: textColors.description }}
          >
            {description}
          </p>

          {/* Star Rating - positioned at top left */}
          <div className="w-fit">{renderStars()}</div>

          {/* Quote Mark - positioned at top right */}
          <div className="absolute -z-0 bottom-[16px] right-[16px] md:bottom-[24px] md:right-[24px]">
            <Image
              src={"/dawn/svg/quotes-icon.svg"}
              alt="testimonial quotes"
              width={36}
              height={40}
              className="object-cover md:hidden"
              unoptimized
            />
            <Image
              src={"/dawn/svg/quotes-icon.svg"}
              alt="testimonial quotes"
              width={65}
              height={52}
              className="object-cover hidden md:block"
              unoptimized
            />
          </div>
        </div>

        {/* Speech bubble tail using clip-path */}
        <div
          className="absolute -bottom-[28px] md:-bottom-[35px] left-0 size-[33px] md:size-[47px] rounded"
          style={{
            backgroundColor: backgroundColor,
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
      </div>

      {/* Customer Image and Name */}
      <div className="flex items-center gap-[1.6rem] mt-4 ml-10">
        <div>
          <Image
            src={image}
            alt={alt || `${name}'s photo`}
            className="object-cover rounded-full flex-shrink-0 md:hidden"
            width={42}
            height={42}
          />
          <Image
            src={image}
            alt={alt || `${name}'s photo`}
            className="object-cover rounded-full flex-shrink-0 hidden md:block"
            width={60}
            height={60}
          />
        </div>
        <h3
          className="font-bold text-text-sm md:text-text-lg"
          style={{ color: textColors.name }}
        >
          {name}
        </h3>
      </div>
    </div>
  );
};
