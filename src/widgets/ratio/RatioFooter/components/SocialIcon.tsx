import React from "react";
import { SOCIAL_BRAND_COLORS, SOCIAL_ICONS } from "../constants";

interface SocialIconProps {
  iconName: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  iconName,
  className = "",
}) => {
  const IconComponent = SOCIAL_ICONS[iconName as keyof typeof SOCIAL_ICONS];
  const brandColors =
    SOCIAL_BRAND_COLORS[iconName as keyof typeof SOCIAL_BRAND_COLORS];

  if (!IconComponent || !brandColors) {
    return null;
  }

  return (
    <div
      className={`
        ${className} size-[34px] lg:size-[34px]
        flex items-center justify-center
        border border-transparent rounded-[50%]
        transition-all duration-300 ease-in-out
        border-white
        text-white
        ${brandColors.borderColor}
        ${brandColors.iconColor}
        group
      `}
    >
      {IconComponent}
    </div>
  );
};
