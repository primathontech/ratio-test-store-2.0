import { ProductMetadataKey } from "@/widgets/common/ProductDetail/types";

export interface AdditionalInfoItem {
  label: string;
  value: string | null;
}

export interface AdditionalInfoSettings {
  marketedBy?: string;
  countryOfOrigin?: string;
  customerCareDetails?: string;
}

export function normalizeValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    const joined = value.filter(Boolean).join(", ").trim();
    return joined || null;
  }
  if (typeof value === "string") {
    return value.trim() || null;
  }
  return String(value).trim() || null;
}

export function ensureArray<T = unknown>(value: unknown): T[] {
  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value as T[];
  }
  if (typeof value === "string") {
    return (value.trim() ? [value] : []) as T[];
  }
  return [value as T];
}

export function getFirstValue(value: unknown): string | null {
  if (value == null) {
    return null;
  }
  if (Array.isArray(value)) {
    const first = value.find((v) => v !== null && v !== undefined && v !== "");
    if (first == null) {
      return null;
    }
    return typeof first === "string" ? first : String(first);
  }
  if (typeof value === "string") {
    return value || null;
  }
  return String(value);
}

export function getAdditionalInfoItems(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any,
  settings: AdditionalInfoSettings = {}
): AdditionalInfoItem[] {
  const { marketedBy, countryOfOrigin, customerCareDetails } = settings;

  const items: AdditionalInfoItem[] = [
    {
      label: "Generic Name",
      value: normalizeValue(metadata?.[ProductMetadataKey.GENERIC_NAME]?.value),
    },
    {
      label: "Best Before",
      value: normalizeValue(metadata?.[ProductMetadataKey.BEST_BEFORE]?.value),
    },
    {
      label: "Dimensions",
      value: normalizeValue(metadata?.[ProductMetadataKey.DIMENSIONS]?.value),
    },
    {
      label: "License No.",
      value: normalizeValue(
        metadata?.[ProductMetadataKey.LICENSE_NUMBER]?.value
      ),
    },
    {
      label: "Manufacturer",
      value: normalizeValue(metadata?.[ProductMetadataKey.MANUFACTURER]?.value),
    },
    { label: "Marketed By", value: normalizeValue(marketedBy) },
    { label: "Country of Origin", value: normalizeValue(countryOfOrigin) },
    {
      label: "Customer Care Details",
      value: normalizeValue(customerCareDetails),
    },
  ];

  return items.filter((item) => item.value !== null);
}

export const DEFAULT_ADDITIONAL_INFO_SETTINGS: Required<AdditionalInfoSettings> =
  {
    marketedBy:
      "Honasa Consumer Limited, 10th and 11th Floor, Capital Cyberscape, Sector 59, Gurugram, Haryana, 122101",
    countryOfOrigin: "India",
    customerCareDetails:
      "Supratim Sarkar - nodal@honasa.in | +91 7303086765 (refer to Marketed By address)",
  };
