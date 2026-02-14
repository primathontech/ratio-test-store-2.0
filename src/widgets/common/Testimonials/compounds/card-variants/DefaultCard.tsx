import React from "react";
import Image from "next/image";
import { CardVariantProps } from "./types";

/**
 * Default testimonial card variant
 * Classic layout with centered content
 */
export const DefaultCard: React.FC<CardVariantProps> = ({
  testimonial,
  styleConfig = {},
}) => {
  const { image, name, location, stars, title, description, alt } = testimonial;

  const {
    backgroundColor = "#e6f0fa",
    border = { width: "0", color: "transparent", radius: "1rem" },
    shadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    padding = "1.5rem",
    textColors = {
      name: "#111827",
      location: "#6b7280",
      title: "#111827",
      description: "#4b5563",
    },
    starColor = "#fbbf24",
    starEmptyColor = "#d1d5db",
    image: imageConfig = {
      size: "5rem",
      borderWidth: "4px",
      borderColor: "#dbeafe",
      borderRadius: "9999px",
    },
    customClasses = "",
    customStyles = {},
  } = styleConfig;

  // Generate star rating display
  const renderStars = () => {
    return (
      <div className="flex gap-1 mb-3" aria-label={`${stars} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5"
            style={{ color: i < stars ? starColor : starEmptyColor }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-center ${customClasses}`}>
      <div
        className="w-full h-full flex flex-col"
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
          <div
            className="relative overflow-hidden"
            style={{
              width: imageConfig.size,
              height: imageConfig.size,
              borderWidth: imageConfig.borderWidth,
              borderColor: imageConfig.borderColor,
              borderRadius: imageConfig.borderRadius,
              borderStyle: "solid",
            }}
          >
            <Image
              src={image}
              alt={alt || `${name}'s photo`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Customer Name and Location */}
        <div className="text-center mb-3">
          <h3
            className="font-semibold text-lg"
            style={{ color: textColors.name }}
          >
            {name}
          </h3>
          {location && (
            <p className="text-sm mt-1" style={{ color: textColors.location }}>
              {location}
            </p>
          )}
        </div>

        {/* Star Rating */}
        <div className="flex justify-center">{renderStars()}</div>

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
