import React from "react";
import { SOCIAL_ICONS, SOCIAL_BRAND_COLORS } from "../constants";

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
        ${className} xl:size-[36px]
        flex items-center justify-center
        xl:border border-transparent rounded-full
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
