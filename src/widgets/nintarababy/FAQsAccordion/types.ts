import { WidgetProps } from "@/widgets/types";

/**
 * FAQsAccordion widget settings
 */
export interface FAQsAccordionSettings {
  /** Widget variant @default "v1" */
  variant?: string;
}

/**
 * Single FAQ item
 */
export interface FAQItem {
  /** Question text */
  question: string;
  /** Answer text */
  answer: string;
}

/**
 * FAQsAccordion widget data
 */
export interface FAQsAccordionData {
  /** Section heading text */
  heading?: string;
  /** Array of FAQ items */
  items?: FAQItem[];
}

/**
 * Props for the FAQsAccordion component
 */
export type FAQsAccordionProps = WidgetProps<
  FAQsAccordionData,
  FAQsAccordionSettings
>;

/**
 * Design tokens extracted from nintarababy.in FAQsAccordion section
 * Source: https://nintarababy.in/products/ergopod-feeding-pillow-lucky-clover
 * Selector: #shopify-section-template--24784210329906__product_accordion_pdp_ephPMM
 * Rendered height: 570px | topOffset: 4653px
 */
export const DESIGN_TOKENS = {
  colors: {
    background: "#ffffff",
    border: "#ebe6e6",
    questionText: "#092a33",
    answerText: "#092a33",
    iconColor: "#092a33",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    heading: {
      fontSize: "32px",
      fontSizeMobile: "24px",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "30px",
      marginBottomMobile: "15px",
    },
    question: {
      fontSize: "16px",
      fontWeight: "500",
      lineHeight: "23.4px",
    },
    answer: {
      fontSize: "14px",
      fontSizeMobile: "16px",
      fontWeight: "400",
      marginBottom: "15px",
    },
    icon: {
      fontSize: "32px",
    },
  },
  spacing: {
    sectionPaddingTopDesktop: "40px",
    sectionPaddingBottomDesktop: "60px",
    sectionPaddingTopMobile: "30px",
    sectionPaddingBottomMobile: "40px",
    containerMaxWidth: "1420px",
    questionPaddingDesktop: "16px 0",
    questionPaddingMobile: "16px 10px 16px 0",
  },
  transitions: {
    panel: "max-height 0.2s ease-out",
    toggle: "0.4s",
  },
} as const;

/**
 * Default FAQ items matching the source site
 */
export const DEFAULT_HEADING = "FAQs";

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question:
      "What are the features of the ErgoPod Feeding Pillow- Lucky Clover?",
    answer:
      "ErgoPod combines a supportive wrap-around shape with a built-in lumbar panel, adjustable velcro fit, and a silent-release buckle. The surface is firm yet comfortable, the upper lining is waterproof for hygiene, and the 100% cotton cover is removable and machine washable. The side pocket keeps essentials handy.",
  },
  {
    question:
      "How does the ErgoPod Feeding Pillow- Lucky Clover help me with the baby?",
    answer:
      "By lifting the baby to an optimal height, ErgoPod Feeding Pillow- Lucky Clover supports a consistent latch and reduces the need to hold the baby up with your arms. This lowers fatigue and helps you focus on a calm, effective feed.",
  },
  {
    question: "How do you use the ErgoPod Feeding Pillow- Lucky Clover?",
    answer:
      "Wrap it around your waist, adjust the velcro for a comfort fit, lock the buckle, and rest your lower back against the lumbar panel. Place the baby on the pillow at nipple height, feed, then release the silent buckle to remove. Unzip the cover to wash when needed.",
  },
  {
    question:
      "Will the ErgoPod Feeding Pillow- Lucky Clover fit different body types?",
    answer:
      "The adjustable strap and generous wrap-around design fit most waist sizes.",
  },
  {
    question: "How do I clean the ErgoPod Feeding Pillow- Lucky Clover daily?",
    answer:
      "For small spills, wipe the waterproof upper with a damp cloth. For regular refresh, remove the 100% cotton cover and machine wash on gentle. Make sure the cover is fully dry before re-use.",
  },
  {
    question:
      "Can I bottle-feed with the ErgoPod Feeding Pillow- Lucky Clover?",
    answer:
      "The stable surface and side pocket make it equally useful for bottle feeding sessions.",
  },
  {
    question: "Will the buckle wake my sleeping baby?",
    answer:
      "The buckle is designed for silent release so you can remove the pillow discreetly after the baby sleeps.",
  },
];
