import { METAFIELD_KEYS } from "../constants/metafield-keys";

/**
 * Interface for additional info item
 */
export interface AdditionalInfoItem {
  label: string;
  value: string | null;
}

/**
 * Interface for additional info settings
 */
export interface AdditionalInfoSettings {
  marketedBy?: string;
  countryOfOrigin?: string;
  customerCareDetails?: string;
}

/**
 * Helper function to get metafield value by key
 */
export const getMetafieldValue = (
  metafields: any[],
  key: string
): string | null => {
  return metafields?.find((field: any) => field?.key === key)?.value || null;
};

/**
 * Utility function to fetch and structure additional info details
 * Combines metafield data with settings-based configuration
 *
 * @param metafields - Array of metafields from product data
 * @param settings - Settings object containing configurable values
 * @returns Array of additional info items with labels and values
 */
export function normalizeValue(value: unknown): string | null {
  if (!value) return null;

  // If array → join non-empty values
  if (Array.isArray(value)) {
    const joined = value.filter(Boolean).join(", ");
    return joined.trim() || null;
  }

  // If string
  if (typeof value === "string") {
    return value.trim() || null;
  }

  // Fallback (number, boolean, etc.)
  return String(value).trim() || null;
}

export function getAdditionalInfoItems(
  metadata: any,
  settings: AdditionalInfoSettings = {}
): AdditionalInfoItem[] {
  const { marketedBy, countryOfOrigin, customerCareDetails } = settings;

  const items: AdditionalInfoItem[] = [
    {
      label: "Generic Name",
      value: normalizeValue(metadata?.[METAFIELD_KEYS.GENERIC_NAME]?.value),
    },
    {
      label: "Best Before",
      value: normalizeValue(metadata?.[METAFIELD_KEYS.BEST_BEFORE]?.value),
    },
    {
      label: "Dimensions",
      value: normalizeValue(metadata?.[METAFIELD_KEYS.DIMENSIONS]?.value),
    },
    {
      label: "License No.",
      value: normalizeValue(metadata?.[METAFIELD_KEYS.LICENSE_NUMBER]?.value),
    },
    {
      label: "Manufacturer",
      value: normalizeValue(metadata?.[METAFIELD_KEYS.MANUFACTURER]?.value),
    },
    {
      label: "Marketed By",
      value: normalizeValue(marketedBy),
    },
    {
      label: "Country of Origin",
      value: normalizeValue(countryOfOrigin),
    },
    {
      label: "Customer Care Details",
      value: normalizeValue(customerCareDetails),
    },
  ];

  return items.filter((item) => item.value !== null);
}

/**
 * Default values for additional info settings
 * These can be used as fallbacks when settings are not provided
 */
export const DEFAULT_ADDITIONAL_INFO_SETTINGS: AdditionalInfoSettings = {
  marketedBy:
    "Honasa Consumer Limited, 10th and 11th Floor, Capital Cyberscape, Sector 59, Gurugram, Haryana, 122101",
  countryOfOrigin: "India",
  customerCareDetails:
    "Supratim Sarkar - nodal@honasa.in | +91 7303086765 (refer to Marketed By address)",
};
