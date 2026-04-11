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
 * HairCareBFFs widget settings
 */
export interface HairCareBFFsSettings {
  /** Widget variant */
  variant?: string;
  /** Section heading — normal weight part */
  headingNormal?: string;
  /** Section heading — bold part */
  headingBold?: string;
  /** Background image path */
  backgroundImage?: string;
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
