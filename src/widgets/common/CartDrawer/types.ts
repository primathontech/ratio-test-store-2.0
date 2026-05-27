import { WidgetProps } from "@/widgets/types";

/**
 * Configuration options for the CartDrawer widget
 */
export interface CartDrawerSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Show shipping info
   * @default false
   */
  showShippingInfo?: boolean;

  /**
   * Currency symbol
   * @default '₹'
   */
  currencySymbol?: string;

  /**
   * Checkout button text
   * @default 'Checkout'
   */
  checkoutText?: string;
}

/**
 * Cart drawer data (no additional data needed, uses cart context)
 */
export interface CartDrawerData {
  // No additional data needed - uses cart context from @shopkit/cart
}

export type CartDrawerProps = WidgetProps<CartDrawerData, CartDrawerSettings>;

// Coupon-related types (used by CouponOffersComponent and useCoupons)
export interface CouponOffer {
  id: string;
  title: string;
  code: string;
  description: string;
}

export interface UseCouponsReturn {
  coupons: CouponOffer[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
