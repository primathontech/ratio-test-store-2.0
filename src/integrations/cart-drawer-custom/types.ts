/**
 * Custom Cart Drawer Types
 */

export interface CustomCartDrawerProps {
  /**
   * Locale for the cart drawer
   */
  locale?: string;
}

// Simplified coupon interface for UI components
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
