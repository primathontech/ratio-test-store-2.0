import { WidgetProps } from "@/widgets/types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";

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
  /** Section heading text (V2) */
  title?: string;
  /** Section heading text (V1, mirrors docs/ProductAdditionalInfoSection convention) */
  sectionTitle?: string;
  /** Info blocks to display in the expanded grid (V1, fallback only) */
  items?: InfoBlock[];
  /** Whether the accordion starts expanded */
  defaultExpanded?: boolean;
  /** "Marketed By" address shown in V1 grid (V1) */
  marketedBy?: string;
  /** "Country of Origin" shown in V1 grid (V1) */
  countryOfOrigin?: string;
  /** "Customer Care Details" line shown in V1 grid (V1) */
  customerCareDetails?: string;
}

/**
 * AdditionalInformation widget data
 *  - V1 (product detail): IResponse from DATA_SOURCE_TYPES.PRODUCT
 *  - V2 (collection page): IResponse from DATA_SOURCE_TYPES.COLLECTION
 */
export interface AdditionalInformationData {
  success?: boolean;
  data?:
    | ApiProduct
    | {
        data?: {
          collectionByHandle?: {
            description?: string;
          };
        };
      }
    | null;
}

/**
 * Props for the AdditionalInformation component
 */
export type AdditionalInformationProps = WidgetProps<
  AdditionalInformationData,
  AdditionalInformationSettings
>;
