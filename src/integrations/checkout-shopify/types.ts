import React from "react";

/**
 * Props for the CheckoutButtonShopify component
 */
export interface CheckoutButtonShopifyProps {
  /**
   * Button text
   * @default 'Checkout'
   */
  children?: React.ReactNode;

  /**
   * Custom button className
   */
  className?: string;

  /**
   * Custom button styles
   */
  style?: React.CSSProperties;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Callback when checkout starts
   */
  onCheckoutStart?: () => void;

  /**
   * Callback when checkout completes successfully
   */
  onCheckoutSuccess?: (order: any) => void;

  /**
   * Callback when checkout fails
   */
  onCheckoutError?: (error: Error) => void;

  /**
   * Whether to clear cart after successful checkout
   * @default true
   */
  clearCartOnSuccess?: boolean;

  /**
   * Whether to close cart drawer after successful checkout
   * @default true
   */
  closeCartOnSuccess?: boolean;

  /**
   * Custom redirect path after successful checkout
   */
  redirectPath?: string;

  /**
   * Additional props to pass to the button element
   */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * Props for the BuyNowButtonShopify component
 */
export interface BuyNowButtonShopifyProps {
  /**
   * Button text
   * @default 'Buy Now'
   */
  children?: React.ReactNode;

  /**
   * Custom button className
   */
  className?: string;

  /**
   * Custom button styles
   */
  style?: React.CSSProperties;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Product variant ID
   */
  variantId: string;

  /**
   * Product ID
   */
  productId: string;

  /**
   * Product title
   */
  title: string;

  /**
   * Product price
   */
  price: {
    amount: number;
    currencyCode: string;
  };

  /**
   * Product quantity
   */
  quantity: number;

  /**
   * Product image URL
   */
  imageUrl?: string;

  /**
   * Callback when checkout starts
   */
  onCheckoutStart?: () => void;

  /**
   * Callback when checkout completes successfully
   */
  onCheckoutSuccess?: (order: any) => void;

  /**
   * Callback when checkout fails
   */
  onCheckoutError?: (error: Error) => void;

  /**
   * Custom redirect path after successful checkout
   */
  redirectPath?: string;

  /**
   * Custom loading content to display when checkout is in progress
   * If not provided, a default spinner will be shown
   */
  loadingContent?: React.ReactNode;

  /**
   * Additional props to pass to the button element
   */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}
