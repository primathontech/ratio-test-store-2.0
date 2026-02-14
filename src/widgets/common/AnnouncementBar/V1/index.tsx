"use client";

import React, { useState } from "react";
import { Props } from "../types";
import { MarqueeText } from "../compounds/MarqueeText";
import { CloseButton } from "../compounds/CloseButton";
import { AnnouncementText } from "../compounds/AnnouncementText";
import { Separator } from "../compounds/Separator";
import { ActionButton } from "../compounds/ActionButton";
import { generateResponsiveStyles } from "../compounds/utils";

export const V1 = ({ settings }: Props) => {
  const {
    width = "full",
    backgroundColor = "#279989",
    fontColor = "#ffffff",
    heightMobile = "40px",
    heightDesktop = "48px",
    fontSizeMobile = "14px",
    fontSizeDesktop = "16px",
    texts = [],
    mode = "marquee",
    marqueeSpeed = "30s",
    pauseOnHover = true,
    separator,
    ariaLabel = "Announcement banner",
    showCloseButton = false,
    textJustifyContent = "space-evenly",
    // action button props
    showActionButton = true,
    actionButtonText = "Shop Now",
    actionButtonHref,
    actionButtonTarget = "_self",
    actionButtonPosition = "right",
    actionButtonHeight,
    actionButtonWidth,
    actionButtonBorderRadius,
    actionButtonBorderColor,
    actionButtonTextColor,
    actionButtonBackgroundColor,
  } = settings;

  const [isVisible, setIsVisible] = useState(true);

  // Early return if no texts or not visible
  if (!texts || texts.length === 0 || !isVisible) {
    return null;
  }

  // Close handler
  const handleClose = () => {
    setIsVisible(false);
  };

  // Generate responsive styles using utility
  const responsiveStyles = generateResponsiveStyles({
    heightMobile,
    heightDesktop,
    fontSizeMobile,
    fontSizeDesktop,
  });

  // Generate CSS styles
  const wrapperStyles: React.CSSProperties = {
    position: "relative",
    backgroundColor: backgroundColor,
  };

  // Generate CSS styles based on action button position
  const getJustifyContent = () => {
    switch (actionButtonPosition) {
      case "left":
        return "flex-start";
      case "center":
        return "center";
      case "right":
        return "space-between";
      default:
        return "space-evenly";
    }
  };

  const containerStyles: React.CSSProperties = {
    width: width === "full" ? "100vw" : width === "container" ? "100%" : width,
    display: "flex",
    alignItems: "center",
    justifyContent: getJustifyContent(),
    margin: "auto",
    padding: "0 16px",
    overflow: "hidden",
    gap: 4,
  };

  const textContainerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: textJustifyContent,
    margin: "auto",
    gap: "16px",
    flex: "1",
    overflow: "hidden",
  };

  return (
    <div style={wrapperStyles}>
      <style>{responsiveStyles}</style>
      <div
        className="announcement-bar"
        role="banner"
        style={containerStyles}
        aria-label={ariaLabel}
      >
        <div style={textContainerStyles}>
          {mode === "marquee" || mode === "marquee-reverse" ? (
            <MarqueeText
              texts={texts}
              fontColor={fontColor}
              marqueeSpeed={marqueeSpeed}
              pauseOnHover={pauseOnHover}
              reverse={mode === "marquee-reverse"}
              separator={separator}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {texts.map((text, idx) => (
                <React.Fragment key={text.id || idx}>
                  <AnnouncementText text={text} fontColor={fontColor} />
                  {separator && idx < texts.length - 1 && (
                    <Separator type={separator} fontColor={fontColor} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        {showActionButton && (
          <ActionButton
            text={actionButtonText}
            href={actionButtonHref}
            target={actionButtonTarget}
            position={actionButtonPosition}
            height={actionButtonHeight}
            width={actionButtonWidth}
            borderRadius={actionButtonBorderRadius}
            borderColor={actionButtonBorderColor}
            textColor={actionButtonTextColor}
            backgroundColor={actionButtonBackgroundColor}
          />
        )}
      </div>
      {showCloseButton && <CloseButton onClose={handleClose} />}
    </div>
  );
};
