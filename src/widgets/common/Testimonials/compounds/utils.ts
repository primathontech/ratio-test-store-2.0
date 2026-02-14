interface HeadingStylesConfig {
  headingFontSizeMobile?: string;
  headingFontSizeDesktop?: string;
  headingColor?: string;
  subheadingFontSizeMobile?: string;
  subheadingFontSizeDesktop?: string;
  subheadingColor?: string;
  headingFontSizeTablet?: string;
}

export const generateHeadingStyles = ({
  headingFontSizeMobile = "24px",
  headingFontSizeDesktop = "36px",
  headingColor = "#111827",
  subheadingFontSizeMobile = "12px",
  subheadingFontSizeDesktop = "16px",
  subheadingColor = "#4B5563",
  headingFontSizeTablet = "32px",
}: HeadingStylesConfig): string => {
  return `
    .section-heading {
      font-size: ${headingFontSizeMobile};
      color: ${headingColor};
    }
    .section-subheading {
      font-size: ${subheadingFontSizeMobile};
      color: ${subheadingColor};
    }
    @media (min-width: 768px) {
      .section-heading {
        font-size: ${headingFontSizeTablet};
      }
    }
    @media (min-width: 1025px) {
      .section-heading {
        font-size: ${headingFontSizeDesktop};
      }
      .section-subheading {
        font-size: ${subheadingFontSizeDesktop};
      }
    }
  `;
};
