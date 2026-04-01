import { WidgetProps } from "@/widgets/types";

/**
 * A single step item (used in "How to Use")
 */
export interface ProductTabStep {
  label: string;
  text: string;
}

/**
 * A power ingredient item (used in "Power Ingredients")
 */
export interface ProductTabIngredient {
  image: string;
  label: string;
  text: string;
}

/**
 * A chemical ingredient listing (used in "Ingredients List")
 */
export interface ProductTabIngredientListing {
  label: string;
  text: string;
}

/**
 * A single accordion tab
 */
export interface ProductTab {
  /** Tab title displayed in the summary row */
  title: string;
  /** Type of content rendering */
  type: "html" | "steps" | "ingredients" | "list" | "ingredientsList";
  /** HTML content (for "html" type) */
  contentHTML?: string;
  /** Step-by-step items (for "steps" type) */
  steps?: ProductTabStep[];
  /** Ingredient items with images (for "ingredients" type) */
  ingredients?: ProductTabIngredient[];
  /** Simple text list items (for "list" type) */
  items?: string[];
  /** Chemical ingredient listings (for "ingredientsList" type) */
  ingredientListings?: ProductTabIngredientListing[];
}

/**
 * ProductTabs widget settings
 */
export interface ProductTabsSettings {
  /** Widget variant */
  variant?: string;
  /** Accordion tabs data */
  tabs?: ProductTab[];
}

/**
 * ProductTabs widget data (static section, no API data needed)
 */
export interface ProductTabsData {
  // Static content section — no dynamic data
}

/**
 * Props for the ProductTabs component
 */
export type ProductTabsProps = WidgetProps<
  ProductTabsData,
  ProductTabsSettings
>;
