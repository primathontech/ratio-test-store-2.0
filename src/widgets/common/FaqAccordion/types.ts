import { WidgetProps } from "@/widgets/types";

/**
 * FaqAccordion widget settings
 */
export interface FaqAccordionSettings {
  variant?: string;
  title?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FaqAccordionProps = WidgetProps<any, FaqAccordionSettings>;
