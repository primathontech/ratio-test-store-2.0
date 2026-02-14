import React from "react";
import Image from "next/image";
import { CardVariantProps } from "./types";

/**
 * Default testimonial card variant
 * Classic layout with centered content
 */
export const AquaLogicaTestimonialCard: React.FC<CardVariantProps> = ({
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
      borderColor: "#06c",
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
        <div className="flex justify-center items-center p-2">
          <div className="relative">
            <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-[#06c] z-[40]">
              <Image
                src={image}
                alt={alt || `${name}'s photo`}
                fill
                className="object-cover rounded-full"
              />
            </div>
            {/* Blue decorative circles*/}
            <div className="absolute -top-2 -left-6 w-[58px] h-[58px] bg-[#06c] rounded-full"></div>
            <div className="absolute top-3/4 -translate-y-1/2 -right-2 w-[50px] h-[50px] bg-[#06c] rounded-full"></div>
          </div>
        </div>

        <div className="flex gap-2 items-center justify-center text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="#06c"
            viewBox="0 0 20 20"
          >
            <g transform="translate(-0.008 0)">
              <path
                className="correct-checkmark"
                d="M26.071,12.843l-2.452-1.091L22.528,9.3l-2.668.279L17.689,8,15.517,9.578,12.85,9.3,11.76,11.751,9.307,12.843l.279,2.668L8.012,17.681l1.574,2.172L9.307,22.52l2.452,1.091,1.092,2.453,2.668-.279,2.171,1.574,2.172-1.574,2.667.279,1.091-2.452,2.453-1.092-.279-2.668,1.574-2.171-1.574-2.172ZM15.754,21.552l-2.739-2.739.913-.91,1.826,1.823,5.474-5.474.913.913Zm0,0"
                transform="translate(-7.682 -7.681)"
              ></path>
              <g transform="translate(0.008 0)">
                <path
                  className="correct-checkmark"
                  d="M19.946,9.811l-1.5-2.072.266-2.545a.323.323,0,0,0-.19-.328l-2.338-1.04-1.04-2.338a.325.325,0,0,0-.328-.19l-2.545.266L10.2.062a.322.322,0,0,0-.379,0l-2.072,1.5L5.2,1.3a.327.327,0,0,0-.328.19L3.832,3.825,1.494,4.866a.322.322,0,0,0-.19.328l.266,2.545L.069,9.811a.322.322,0,0,0,0,.379l1.5,2.072L1.3,14.807a.323.323,0,0,0,.19.328l2.338,1.04,1.04,2.338a.326.326,0,0,0,.328.19l2.545-.266,2.072,1.5a.322.322,0,0,0,.379,0l2.072-1.5,2.545.266a.324.324,0,0,0,.328-.19l1.04-2.338,2.338-1.041a.323.323,0,0,0,.19-.328l-.266-2.545,1.5-2.072a.322.322,0,0,0,0-.379Zm-2.1,2.172a.322.322,0,0,0-.06.223l.254,2.435-2.237,1a.32.32,0,0,0-.164.163l-1,2.237-2.435-.255a.322.322,0,0,0-.223.06l-1.982,1.437L8.025,17.842a.319.319,0,0,0-.189-.062.21.21,0,0,0-.032,0l-2.436.255-1-2.237a.322.322,0,0,0-.164-.164l-2.238-1,.254-2.435a.323.323,0,0,0-.06-.223L.729,10,2.165,8.018a.323.323,0,0,0,.06-.223L1.971,5.36l2.237-1A.32.32,0,0,0,4.372,4.2l1-2.237L7.8,2.218a.325.325,0,0,0,.223-.06L10.007.721,11.99,2.158a.324.324,0,0,0,.223.06l2.435-.255,1,2.237a.322.322,0,0,0,.164.164l2.237,1L17.79,7.795a.322.322,0,0,0,.06.223L19.286,10Zm0,0"
                  transform="translate(-0.008 0)"
                ></path>
              </g>
            </g>
          </svg>
          Verified Customer
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
