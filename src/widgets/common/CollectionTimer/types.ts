import { WidgetProps } from "@/widgets/types";

/**
 * CollectionTimer widget settings
 */
export interface CollectionTimerSettings {
  /** Widget variant */
  variant?: string;
  /** End date string e.g. "Apr 30, 2026 23:59:59" */
  endDateString?: string;
  /** Timer tick interval in ms (default 1000) */
  timerInterval?: number;
  /** Text shown above the timer e.g. "Hurry Up!" */
  urgencyText?: string;
  /** Label shown below urgency text e.g. "Sale ends in:" */
  saleLabel?: string;
  /** Text shown when the offer is expired */
  expiredText?: string;
  /** Whether to render this widget at all (default true) */
  visible?: boolean;
  /** Bar background color */
  backgroundColor?: string;
  /** Primary text color */
  textColor?: string;
  /** Color for the urgency heading + decorative lines */
  urgencyColor?: string;
  /** Inline styles forwarded to the root element */
  style?: React.CSSProperties;
}

/**
 * CollectionTimer widget data — static section, no API data needed.
 */
export interface CollectionTimerData {
  // Static — driven by settings only
}

/**
 * Props for the CollectionTimer component
 */
export type CollectionTimerProps = WidgetProps<
  CollectionTimerData,
  CollectionTimerSettings
>;
