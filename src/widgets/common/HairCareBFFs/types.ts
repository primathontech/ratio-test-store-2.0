import { WidgetProps } from "@/widgets/types";
import type {
  ApiProduct,
  ApiCollectionResult,
} from "@/widgets/common/FeaturedCollectionGrid/types";

/**
 * Re-export API types used in the transform layer.
 */
export type { ApiProduct, ApiCollectionResult };

/**
 * Per-collection tab config. The collection handle itself lives in the
 * data source (`handles: [...]`) — that's the single source of truth.
 * This object only attaches presentation data (label) and an optional
 * View All override.
 */
export interface HairCareBFFsTabConfig {
  /** Display label for the tab. Falls back to the server title, then handle. */
  label?: string;
  /**
   * Optional override for the "View all" link target (and its thumbnails).
   * When omitted, View All reuses the server-fetched collection with no
   * extra fetch. When different from the handle this entry is keyed under,
   * the LazyViewAllButton lazy-fetches it on intersection.
   */
  viewAllCollectionHandle?: string;
}

/**
 * HairCareBFFs widget settings
 */
export interface HairCareBFFsSettings {
  /** Widget variant */
  variant?: string;
  /**
   * Rich-text section heading. Inline HTML is allowed for emphasis —
   * e.g. `Hair Care <strong>BFFs</strong>`. Set by the template; rendered
   * via `dangerouslySetInnerHTML`.
   */
  heading?: string;
  /** Background image path (desktop) */
  backgroundImage?: string;
  /** Background image path (mobile) */
  backgroundImageMobile?: string;
  /**
   * Optional per-tab presentation overrides, in the same order as the
   * data source's `handles` array. Each entry only carries label / View All
   * data — the handle itself comes from the data source (single source of
   * truth). Missing or short arrays fall back to server defaults per tab.
   */
  collections?: HairCareBFFsTabConfig[];
  /** Add-to-cart button text. Defaults to "Add to cart". */
  actionButtonText?: string;
  /** Sold-out fallback text. Defaults to "Sold Out". */
  soldOutText?: string;
}

/**
 * HairCareBFFs widget data — response from COLLECTION_BY_HANDLES
 *
 * Shape: { success, data: [{ handle, data: { title, products } }, ...] }
 */
export interface HairCareBFFsData {
  success?: boolean;
  message?: string;
  data?: ApiCollectionResult[] | null;
  meta?: Record<string, unknown>;
}

/**
 * Props for the HairCareBFFs component
 */
export type HairCareBFFsProps = WidgetProps<
  HairCareBFFsData,
  HairCareBFFsSettings
>;
