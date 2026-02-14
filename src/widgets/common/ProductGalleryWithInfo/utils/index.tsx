type ParsedValue = {
  scale_min: number;
  scale_max: number;
  value: number;
};

export const parseValue = (value: string): ParsedValue | null => {
  try {
    const parsed = JSON.parse(value) as {
      scale_min: string;
      scale_max: string;
      value: string;
    };

    return {
      scale_min: parseFloat(parsed.scale_min),
      scale_max: parseFloat(parsed.scale_max),
      value: parseFloat(parsed.value),
    };
  } catch (error) {
    console.error("Invalid value format:", error);
    return null;
  }
};

export const isRatingValue = (value: unknown): value is ParsedValue => {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    typeof (value as any).value === "number"
  );
};

export const getUnitPrice = (
  price: number,
  netContent: string
): string | null => {
  if (!/^\d/.test(netContent.trim())) return null;
  const match = netContent.match(/(\d+(\.\d+)?)/);
  if (!match) return null;

  const contentValue = parseFloat(match[0]);
  if (isNaN(contentValue) || contentValue === 0) return null;

  // Calculate unit price
  const unitPrice = price / contentValue;

  // Format to 2 decimal places
  return unitPrice.toFixed(2);
};

export const getUnitValue = (netContent: string | null): string | null => {
  if (!netContent) return null;
  if (!/^\d/.test(netContent.trim())) return null;
  return netContent.replace(/\d+/g, "").trim();
};
export const calculateDiscountPercentage = (
  compareAtPrice: number,
  currentPrice: number
): number => {
  if (!compareAtPrice || compareAtPrice <= currentPrice) return 0;

  return Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100);
};
