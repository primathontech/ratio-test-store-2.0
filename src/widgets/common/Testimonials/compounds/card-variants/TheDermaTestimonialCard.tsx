import React from "react";
import Image from "next/image";
import { CardVariantProps } from "./types";

/**
 * TheDerma testimonial card variant
 * Clean and professional design with rounded borders and light background
 * Inspired by TheDerma Co's brand aesthetic
 */
export const TheDermaTestimonialCard: React.FC<CardVariantProps> = ({
  testimonial,
  styleConfig = {},
}) => {
  const { image, name, stars, title, description, alt } = testimonial;

  // Default styling with TheDerma brand colors
  const {
    backgroundColor = "#f0f9ff",
    border = { width: "2px", color: "rgb(3, 176, 173)", radius: "1.5rem" },
    shadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    padding = "0px",
    textColors = {
      name: "#0c4a6e",
      location: "#64748b",
      title: "#0f172a",
      description: "#475569",
    },
    starColor = "#fbbf24",
    starEmptyColor = "#e2e8f0",
    image: imageConfig = {
      size: "5rem",
      borderWidth: "3px",
      borderColor: "#38bdf8",
      borderRadius: "9999px",
    },
    customClasses = "",
    customStyles = {},
  } = styleConfig;

  return (
    <div className={`flex items-center justify-center ${customClasses}`}>
      <div
        className="w-full h-full flex flex-col transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor,
          borderWidth: border.width,
          borderColor: border.color,
          borderRadius: border.radius,
          borderStyle: "solid",
          boxShadow: shadow,
          padding,
          ...customStyles,
        }}
      >
        {/* Customer Image */}
        <div className="flex justify-center mb-4">
          <div className="relative overflow-hidden rounded-[1.5rem] w-full">
            <Image
              src={image}
              alt={alt || `${name}'s photo`}
              width={278}
              height={278}
              className="object-cover w-full aspect-square"
            />
          </div>
        </div>

        {/* Customer Name and Location */}
        <div className="text-center flex justify-center items-center gap-2 mb-3">
          <h3 className="font-bold text-lg" style={{ color: textColors.name }}>
            {name}
          </h3>
          <Image
            src="https://images.thedermaco.com/star.svg"
            alt="rating"
            width={10}
            height={10}
          ></Image>
          <span>{stars} | </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              id="verified_"
              data-name="verified "
              d="M15.865,8.534,14.216,6.665l.23-2.472-2.439-.549L10.73,1.5l-2.3.978L6.135,1.5,4.858,3.637,2.419,4.18l.23,2.479L1,8.534,2.649,10.4l-.23,2.479,2.439.549,1.277,2.137,2.3-.985,2.3.978,1.277-2.137,2.439-.549-.23-2.472ZM7.142,11.7,4.574,9.144l1-.991L7.142,9.713l3.953-3.932,1,.991Z"
              transform="translate(-1 -1.5)"
              fill="#0082ff"
            ></path>
          </svg>
        </div>

        {/* Review Title */}
        <h4
          className="font-semibold text-base mb-2 text-center"
          style={{ color: textColors.title }}
        >
          {title}
        </h4>

        {/* Review Description */}
        <p
          className="text-sm text-center leading-relaxed flex-grow"
          style={{ color: textColors.description }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
