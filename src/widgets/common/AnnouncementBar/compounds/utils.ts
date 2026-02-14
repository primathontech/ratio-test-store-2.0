interface ResponsiveStylesConfig {
  heightMobile?: string;
  heightDesktop?: string;
  fontSizeMobile?: string;
  fontSizeDesktop?: string;
  fontColor?: string;
  fontColorMobile?: string;
}

export const generateResponsiveStyles = ({
  heightMobile = "40px",
  heightDesktop = "48px",
  fontSizeMobile = "14px",
  fontSizeDesktop = "16px",
  fontColor = "#ffffff",
  fontColorMobile = "#ffffff",
}: ResponsiveStylesConfig): string => {
  return `
    .announcement-bar {
      height: ${heightMobile};
      font-size: ${fontSizeMobile};
      color: ${fontColorMobile}
    }
    @media (min-width: 642px) {
      .announcement-bar {
        height: ${heightDesktop};
        font-size: ${fontSizeDesktop};
        color: ${fontColor}
      }
    }
  `;
};

export const getSeparatorStyles = (fontColor?: string) => ({
  color: fontColor || "currentColor",
  margin: "0 12px",
  display: "inline-flex" as const,
  alignItems: "center" as const,
});
