import { ProviderContext } from "./base/provider/type";
import { WidgetProps } from "@/widgets/types";
import { VariantType } from "./variants";

export interface ISettings {
  variant: VariantType;
  autoLoadMore?: boolean;

  /** Show action button on product cards (default true) */
  showActionButton?: boolean;
  /** Action button text (default "Add to cart") */
  actionButtonText?: string;
  /** Mobile action button text (default "Add to cart") */
  actionButtonTextMobile?: string;
  /** Show badge on product cards (default true) */
  showBadge?: boolean;
  /** Show rating on product cards (default true) */
  showRating?: boolean;
  /** Sold-out text (default "Sold out") */
  soldOutText?: string;
  /** Mobile sold-out text (default "Sold out") */
  soldOutTextMobile?: string;
  /** Background color for product cards (default "white") */
  productCardBackgroundColor?: string;
  /** Action button text color */
  actionButtonTextColor?: string;
  /** Optional text color for the entire section */
  sectionTextColor?: string;
  /** Filter title (default "Filters") */
  filterTitle?: string;
  /** Sort dropdown trigger text (default "Sort by") */
  sortDropdownText?: string;
  /** Show or hide the Filter and Sort widgets (default true) */
  showFilterAndSort?: boolean;
}

export interface IData {
  [key: string]: unknown;
}

export type TProps = WidgetProps<any, ISettings>;

export interface IProps extends TProps, ProviderContext {}
