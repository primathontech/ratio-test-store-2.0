import { WidgetProps } from "@/widgets/types";

/**
 * CountdownTimer widget settings
 */
export interface CountdownTimerSettings {
  /** Widget variant */
  variant?: string;
  /** ISO date string or date-parseable string for the countdown target */
  targetDate?: string;
  /** Heading text displayed above the countdown */
  heading?: string;
  /** Sub-heading text (e.g. "Hurry! Offer Will Expire in") */
  subheading?: string;
  /** Text shown when the countdown expires */
  expiredText?: string;
}

/**
 * CountdownTimer widget data (static section -- no API data needed)
 */
export interface CountdownTimerData {
  // Pure countdown display -- no dynamic data
}

/**
 * Props for the CountdownTimer component
 */
export type CountdownTimerProps = WidgetProps<
  CountdownTimerData,
  CountdownTimerSettings
>;
