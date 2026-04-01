import { WidgetProps } from "@/widgets/types";

/**
 * A single additional-information block (label + value)
 */
export interface InfoBlock {
  /** The label text (e.g. "MANUFACTURER") */
  label: string;
  /** The value text (may contain \n for line breaks) */
  value: string;
}

/**
 * AdditionalInformation widget settings
 */
export interface AdditionalInformationSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading text */
  title?: string;
  /** Info blocks to display in the expanded grid */
  items?: InfoBlock[];
  /** Whether the accordion starts expanded */
  defaultExpanded?: boolean;
}

/**
 * AdditionalInformation widget data (static section, no API data needed)
 */
export interface AdditionalInformationData {
  // Static content section -- no dynamic data
}

/**
 * Props for the AdditionalInformation component
 */
export type AdditionalInformationProps = WidgetProps<
  AdditionalInformationData,
  AdditionalInformationSettings
>;
