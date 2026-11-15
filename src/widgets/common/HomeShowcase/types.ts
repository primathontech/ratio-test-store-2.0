import { WidgetProps } from "@/widgets/types";

export interface HomeShowcaseSettings {
  variant?: string;
  /** Small kicker above the hero headline. */
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  heroCtaText?: string;
  heroCtaHref?: string;
  featuredHeading?: string;
  collectionsHeading?: string;
}

/**
 * HomeShowcase is fully self-contained: it fetches the configured merchant's
 * collections and products client-side, so it needs no template data source
 * and works for ANY merchant id with zero config.
 */
export type HomeShowcaseProps = WidgetProps<unknown, HomeShowcaseSettings>;
