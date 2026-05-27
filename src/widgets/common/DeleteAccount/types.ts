import { WidgetProps } from "@/widgets/types";

/**
 * DeleteAccount widget settings
 */
export interface DeleteAccountSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
  /** Heading text */
  heading?: string;
  /** Description text */
  description?: string;
  /** Submit button label */
  submitLabel?: string;
  /** Success message shown after submit */
  successMessage?: string;
}

/**
 * DeleteAccount widget data
 */
export interface DeleteAccountData {
  // Static section -- no dynamic data
}

/**
 * Props for the DeleteAccount component
 */
export type DeleteAccountProps = WidgetProps<
  DeleteAccountData,
  DeleteAccountSettings
>;
