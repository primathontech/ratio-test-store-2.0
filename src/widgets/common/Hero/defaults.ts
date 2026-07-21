import type { HeroSharedSettings } from "./contract";

/**
 * Default settings for the common Hero widget — in the SHARED contract shape
 * (see contract.ts). logic.ts adapts these onto the selected variant's VM.
 * These values seed the editor preset, so a palette-added Hero shows real
 * values in the settings sidebar.
 */
export const HeroDefaults: HeroSharedSettings = {
  variant: "v1",
  heading: "Industrial design meets fashion.",
  headingSize: "medium",
  headingColor: "",
  headingCase: "default",
  headingSpacing: "default",
  text: "Atypical leather goods",
  textColor: "",
  textSize: "default",
  ctaLabel: "Shop now",
  ctaHref: "/collections",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  buttonStyle: "default",
  ctaBackground: "",
  ctaTextColor: "",
  image: { src: "/widgets/Hero/V1/banner-1.jpg", alt: "" },
  imageMobile: { src: "/widgets/Hero/V1/banner-2.jpg", alt: "" },
  videoId: "",
  imageBehavior: "default",
  height: "large",
  mobileHeight: "default",
  contentWidth: "default",
  sectionWidth: "default",
  align: "center",
  verticalPosition: "default",
  stackOnMobile: false,
  showTextBox: false,
  colorScheme: "scheme-1",
  sectionBackground: "",
  overlayOpacity: 0,
  overlayColor: "#000000",
  overlayStyle: "default",
  blurredReflection: false,
};
