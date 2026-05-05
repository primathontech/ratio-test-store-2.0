/**
 * Contextual Message Bar Logic
 *
 * This file contains all business logic for calculating and determining
 * which contextual message to display based on cart value and/or product count.
 *
 * All configuration comes from environment variables following this pattern:
 *
 * For Condition 1:
 * - NEXT_PUBLIC_CONTEXT_MESSAGE_1_THRESHOLD_VALUE (e.g., "399") — cart value threshold
 * - NEXT_PUBLIC_CONTEXT_MESSAGE_1_THRESHOLD_PRODUCT_COUNT (e.g., "2") — product count threshold
 * - NEXT_PUBLIC_CONTEXT_MESSAGE_1_DESCRIPTION_MESSAGE (e.g., "Add %count% more to avail 2 Products at ₹699")
 * - NEXT_PUBLIC_CONTEXT_MESSAGE_1_CONGRATS_MESSAGE (e.g., "Congrats! Use code FRESH")
 * - NEXT_PUBLIC_CONTEXT_MESSAGE_1_COUPON_CODE (e.g., "FRESH")
 * - NEXT_PUBLIC_CONTEXT_MESSAGE_1_OFFER_TYPE (e.g., "Free Product")
 * - NEXT_PUBLIC_CONTEXT_MESSAGE_1_STATUS (e.g., "Active")
 *
 * For Condition 2, 3, etc., follow the same pattern with incremented numbers.
 *
 * Placeholders in description messages:
 * - %amount% → replaced with the cart value difference (e.g., ₹200)
 * - %count% → replaced with the product count difference (e.g., 2)
 *
 * A condition's threshold is met when ALL non-zero thresholds are satisfied:
 * - If THRESHOLD_VALUE > 0, cartValue must be >= THRESHOLD_VALUE
 * - If THRESHOLD_PRODUCT_COUNT > 0, productCount must be >= THRESHOLD_PRODUCT_COUNT
 */

export interface ContextualMessageConfig {
  thresholdValue: number;
  thresholdProductCount: number;
  descriptionMessage: string;
  congratsMessage: string;
  couponCode: string;
  offerType: string;
  status: string;
}

export interface ContextualMessageResult {
  shouldShow: boolean;
  message: string;
  couponCode: string | null;
  offerType: string | null;
  // When threshold is crossed, show congrats first, then switch to next offer
  hasAlternatingMessages: boolean;
  congratsMessage?: string; // Message to show first (when threshold is crossed)
  nextOfferMessage?: string; // Message to show after delay (next offer's "add more")
  thresholdProductCount: number; // Product count threshold for the active condition
}

/**
 * Loads all contextual message configurations from environment variables
 * @returns Array of message configurations in condition order (1, 2, 3, ...)
 *
 * Preloads configurations at build time from .env file.
 * Supports multiple conditions (1, 2, 3, 4, 5, etc.) - add more in .env as needed.
 */
export function loadContextualMessageConfigs(): ContextualMessageConfig[] {
  // Preload configurations at build time from env
  const configs: ContextualMessageConfig[] = [
    {
      thresholdValue: parseFloat(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_1_THRESHOLD_VALUE || "0"
      ),
      thresholdProductCount: parseInt(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_1_THRESHOLD_PRODUCT_COUNT ||
          "0",
        10
      ),
      descriptionMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_1_DESCRIPTION_MESSAGE || "",
      congratsMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_1_CONGRATS_MESSAGE || "",
      couponCode: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_1_COUPON_CODE || "",
      offerType: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_1_OFFER_TYPE || "",
      status: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_1_STATUS || "Inactive",
    },
    {
      thresholdValue: parseFloat(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_2_THRESHOLD_VALUE || "0"
      ),
      thresholdProductCount: parseInt(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_2_THRESHOLD_PRODUCT_COUNT ||
          "0",
        10
      ),
      descriptionMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_2_DESCRIPTION_MESSAGE || "",
      congratsMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_2_CONGRATS_MESSAGE || "",
      couponCode: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_2_COUPON_CODE || "",
      offerType: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_2_OFFER_TYPE || "",
      status: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_2_STATUS || "Inactive",
    },
    {
      thresholdValue: parseFloat(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_3_THRESHOLD_VALUE || "0"
      ),
      thresholdProductCount: parseInt(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_3_THRESHOLD_PRODUCT_COUNT ||
          "0",
        10
      ),
      descriptionMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_3_DESCRIPTION_MESSAGE || "",
      congratsMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_3_CONGRATS_MESSAGE || "",
      couponCode: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_3_COUPON_CODE || "",
      offerType: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_3_OFFER_TYPE || "",
      status: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_3_STATUS || "Inactive",
    },
    {
      thresholdValue: parseFloat(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_4_THRESHOLD_VALUE || "0"
      ),
      thresholdProductCount: parseInt(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_4_THRESHOLD_PRODUCT_COUNT ||
          "0",
        10
      ),
      descriptionMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_4_DESCRIPTION_MESSAGE || "",
      congratsMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_4_CONGRATS_MESSAGE || "",
      couponCode: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_4_COUPON_CODE || "",
      offerType: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_4_OFFER_TYPE || "",
      status: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_4_STATUS || "Inactive",
    },
    {
      thresholdValue: parseFloat(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_5_THRESHOLD_VALUE || "0"
      ),
      thresholdProductCount: parseInt(
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_5_THRESHOLD_PRODUCT_COUNT ||
          "0",
        10
      ),
      descriptionMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_5_DESCRIPTION_MESSAGE || "",
      congratsMessage:
        process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_5_CONGRATS_MESSAGE || "",
      couponCode: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_5_COUPON_CODE || "",
      offerType: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_5_OFFER_TYPE || "",
      status: process.env.NEXT_PUBLIC_CONTEXT_MESSAGE_5_STATUS || "Inactive",
    },
  ].filter(
    (config) =>
      // Only include active configurations with at least one valid threshold and required messages
      config.status.toLowerCase() === "active" &&
      (config.thresholdValue > 0 || config.thresholdProductCount > 0) &&
      config.descriptionMessage &&
      config.congratsMessage
  );

  return configs;
}

/**
 * Checks whether a config's threshold is fully met.
 * ALL non-zero thresholds must be satisfied.
 */
function isThresholdMet(
  config: ContextualMessageConfig,
  cartValue: number,
  productCount: number
): boolean {
  if (config.thresholdValue > 0 && cartValue < config.thresholdValue) {
    return false;
  }
  if (
    config.thresholdProductCount > 0 &&
    productCount < config.thresholdProductCount
  ) {
    return false;
  }
  return true;
}

/**
 * Replaces %amount% and %count% placeholders in message
 * @param message - Message template with %amount% and/or %count% placeholders
 * @param config - The config to calculate differences against
 * @param cartValue - Current cart value
 * @param productCount - Current product count in cart
 * @returns Message with replaced placeholders
 */
function replacePlaceholders(
  message: string,
  config: ContextualMessageConfig,
  cartValue: number,
  productCount: number
): string {
  let result = message;

  if (config.thresholdValue > 0) {
    const amountNeeded = Math.max(0, config.thresholdValue - cartValue);
    const formattedAmount = `₹${Math.ceil(amountNeeded).toLocaleString("en-IN")}`;
    result = result.replace(/%amount%/g, formattedAmount);
  }

  if (config.thresholdProductCount > 0) {
    const countNeeded = Math.max(
      0,
      config.thresholdProductCount - productCount
    );
    result = result.replace(/%count%/g, countNeeded.toString());
  }

  return result;
}

/**
 * Calculates which contextual message to display based on cart value and product count
 *
 * Evaluation Rules:
 * 1. Conditions are evaluated in order (condition 1, 2, 3, ...)
 * 2. Only active conditions are considered
 * 3. A threshold is "met" when ALL non-zero thresholds are satisfied
 * 4. If threshold not met → show description message with %amount%/%count% replaced
 * 5. If threshold met and next exists → show alternating congrats + next offer message
 * 6. If all thresholds met → show final congrats message
 *
 * @param cartValue - Current total cart value
 * @param productCount - Current total product count in cart
 * @returns Contextual message result with message to display
 */
export function calculateContextualMessage(
  cartValue: number,
  productCount: number
): ContextualMessageResult {
  // Load all active configurations
  const configs = loadContextualMessageConfigs();

  // If no configurations found, don't show anything
  if (configs.length === 0) {
    return {
      shouldShow: false,
      message: "",
      couponCode: null,
      offerType: null,
      hasAlternatingMessages: false,
      thresholdProductCount: 0,
    };
  }

  // Evaluate conditions in order
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    const { descriptionMessage, congratsMessage, couponCode, offerType } =
      config;

    // If threshold not met, show the "add more" message
    if (!isThresholdMet(config, cartValue, productCount)) {
      const message = replacePlaceholders(
        descriptionMessage,
        config,
        cartValue,
        productCount
      );

      return {
        shouldShow: true,
        message,
        couponCode: null, // No coupon code when showing "add more" message
        offerType,
        hasAlternatingMessages: false,
        thresholdProductCount: config.thresholdProductCount,
      };
    }

    // Threshold met — check if there's a next condition
    if (i < configs.length - 1) {
      const nextConfig = configs[i + 1];

      // If next threshold is not met, show alternating messages:
      // 1. First show congrats message for current threshold
      // 2. Then switch to next offer's "add more" message
      if (!isThresholdMet(nextConfig, cartValue, productCount)) {
        const nextOfferMessage = replacePlaceholders(
          nextConfig.descriptionMessage,
          nextConfig,
          cartValue,
          productCount
        );

        return {
          shouldShow: true,
          message: congratsMessage, // Show congrats first
          couponCode,
          offerType,
          hasAlternatingMessages: true,
          congratsMessage: congratsMessage,
          nextOfferMessage: nextOfferMessage,
          thresholdProductCount: nextConfig.thresholdProductCount,
        };
      }
      // If next threshold is also met, continue to next iteration
      continue;
    }

    // This is the last condition and threshold is met
    // Show congrats message for the final offer (no alternating needed)
    return {
      shouldShow: true,
      message: congratsMessage,
      couponCode,
      offerType,
      hasAlternatingMessages: false,
      thresholdProductCount: config.thresholdProductCount,
    };
  }

  // Fallback: show the final offer's congrats message
  const finalConfig = configs[configs.length - 1];

  return {
    shouldShow: true,
    message: finalConfig.congratsMessage,
    couponCode: finalConfig.couponCode,
    offerType: finalConfig.offerType,
    hasAlternatingMessages: false,
    thresholdProductCount: finalConfig.thresholdProductCount,
  };
}

/**
 * Wrapper for calculateContextualMessage
 * Actual memoization should happen in the consuming component via useMemo
 */
export function useContextualMessage(
  cartValue: number,
  productCount: number
): ContextualMessageResult {
  return calculateContextualMessage(cartValue, productCount);
}
