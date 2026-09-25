import { WidgetProps } from "@/widgets/types";

/**
 * LoadMorePagination widget settings
 */
export interface LoadMorePaginationSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Button label text */
  buttonText?: string;
}

/**
 * LoadMorePagination widget data
 */
export interface LoadMorePaginationData {
  /** URL for the next page to load */
  nextPageUrl?: string;
  /** Whether there are more pages to load */
  hasNextPage?: boolean;
  /** Button label text */
  buttonText?: string;
}

/**
 * Props for the LoadMorePagination component
 */
export type LoadMorePaginationProps = WidgetProps<
  LoadMorePaginationData,
  LoadMorePaginationSettings
>;

/**
 * Design tokens extracted from nintarababy.in collection page
 *
 * Section: Load More / Pagination
 * Centered "Load More" button with outline style.
 * Border: 2px solid #01464f via ::after pseudo-element (absolute inset 0, z-index -2).
 * Hover: sweep-to-right fill from left via ::before (scaleX 0->1), 0.5s ease-out.
 * Text transitions from #01464f to #ffffff on hover (0.3s ease-in-out).
 * Button: 50px height desktop, 44px mobile, pill-shaped (border-radius 60px).
 * Font: Figtree 600 weight, 14px desktop / 13px mobile, line-height 1.
 * Loading: text opacity->0, SVG circular spinner appears (rotator + dash animations).
 * Scroll reveal: translateY(2rem)->0 + opacity 0.01->1, 600ms cubic-bezier(0,0,0.3,1).
 * Wrapper: 40px padding-top, centered text, full width.
 */
export const DESIGN_TOKENS = {
  colors: {
    buttonText: "#01464f",
    buttonTextHover: "#ffffff",
    buttonBorder: "#01464f",
    buttonBackground: "transparent",
    buttonBackgroundHover: "#01464f",
    spinnerStroke: "#01464f",
  },
  typography: {
    fontFamily: "Figtree",
    button: {
      desktop: { fontSize: "14px", fontWeight: "600", lineHeight: "1" },
      mobile: { fontSize: "13px", fontWeight: "600", lineHeight: "1" },
    },
  },
  sizing: {
    button: {
      heightDesktop: "50px",
      heightMobile: "44px",
      paddingDesktop: "0 45px",
      paddingMobile: "0 25px",
      borderRadius: "60px",
    },
    spinner: {
      width: "16px",
      height: "16px",
      strokeWidth: "6",
      viewBox: "0 0 66 66",
      circleRadius: "30",
      circleCx: "33",
      circleCy: "33",
    },
    wrapper: {
      paddingTop: "40px",
    },
  },
  borders: {
    button: "2px solid #01464f",
    borderWidth: "2px",
  },
  transitions: {
    sweepDuration: "0.5s",
    sweepEasing: "ease-out",
    textColorDuration: "0.3s",
    textColorEasing: "ease-in-out",
    revealDuration: "0.6s",
    revealEasing: "cubic-bezier(0, 0, 0.3, 1)",
    spinnerRotatorDuration: "1.4s",
    spinnerDashDuration: "1.4s",
  },
} as const;
