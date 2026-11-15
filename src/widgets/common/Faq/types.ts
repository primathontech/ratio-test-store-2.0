/* Section-level prop types (what the builder passes the widget). */
import type { WidgetProps } from "@/widgets/types";
import type { FaqSharedSettings } from "./contract";

/** Fully editor-driven — no data source. */
export interface FaqData {
  [key: string]: unknown;
}

export type FaqProps = WidgetProps<FaqData, FaqSharedSettings>;
