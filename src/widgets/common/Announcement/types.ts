/* Section-level prop types (what the builder passes the widget). */
import type { WidgetProps } from "@/widgets/types";
import type { AnnouncementSharedSettings } from "./contract";

/** Fully editor-driven — no data source. */
export interface AnnouncementData {
  [key: string]: unknown;
}

export type AnnouncementProps = WidgetProps<
  AnnouncementData,
  AnnouncementSharedSettings
>;
