"use client";

import { useCartStore } from "@shopkit/cart";
import React, { useEffect, useMemo, useState } from "react";
import { ContextualMessageBar } from "../ContextualMessageBar";
import { Props } from "../types";
import { calculateContextualMessage, ContextualMessageResult } from "../utils";

/**
 * ContextualMessage V1 Component
 *
 * Displays a promotional message bar that appears above the BottomBar
 * on mobile devices. The message dynamically updates based on the current
 * cart value and configured thresholds.
 *
 * Features:
 * - Mobile only (hidden on tablet/desktop)
 * - Fixed positioning above BottomBar (matches BottomBar's fixed positioning)
 * - Real-time updates as cart value changes
 * - Environment-driven configuration
 * - Clean, readable typography
 *
 * Design:
 * - Frosted glass: backdrop-filter blur(32px), background #dae6ff99, border 1px solid #F8F8F8
 * - Text: #1D1D1D (dark)
 * - Padding: 10px
 * - Position: Fixed at bottom, above BottomBar
 * - Z-index: 9499 (below BottomBar's 9500, below CartDrawer's 22400)
 *
 * Note: Uses position: fixed to ensure it stays above the fixed BottomBar
 * and appears on all pages consistently, regardless of scroll position.
 */
export const V1: React.FC<Props> = ({
  data: _data,
  settings,
  className = "",
}) => {
  const { items } = useCartStore();
  const [shouldShow, setShouldShow] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [shownCongratsCodes, setShownCongratsCodes] = useState<Set<string>>(
    new Set()
  );
  const {
    showBelowWidth = 768,
    hideContextualMessage = false,
    bottomOffset = 79, // Default to 70px if not specified
    className: settingsClassName = "", // Additional classes from settings
  } = settings ?? {};

  // Delay before switching from congrats to next offer (in milliseconds)
  const MESSAGE_SWITCH_DELAY = 3000; // 3 seconds

  // Calculate cart total in RUPEES (env thresholds are in rupees, e.g. "499").
  // The cart API returns `price.amount` in paise (smallest currency unit), so
  // we divide by 100 to bring it into the same unit as the threshold env vars.
  const cartValue = useMemo(() => {
    const totalInPaise = items.reduce((total, item) => {
      const itemPrice =
        typeof item.price === "number" ? item.price : item.price.amount;
      return total + itemPrice * item.quantity;
    }, 0);
    return totalInPaise / 100;
  }, [items]);

  const productCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  // Calculate which message to show using imported logic
  const messageResult: ContextualMessageResult = useMemo(() => {
    return calculateContextualMessage(cartValue, productCount);
  }, [cartValue, productCount]);

  // Reset shown congrats when cart goes below all thresholds
  useEffect(() => {
    // If no alternating messages (cart is below first threshold), reset tracking
    if (!messageResult.hasAlternatingMessages) {
      setShownCongratsCodes(new Set());
    }
  }, [messageResult.hasAlternatingMessages]);

  // Handle alternating messages when threshold is crossed
  useEffect(() => {
    if (!messageResult.shouldShow || !messageResult.message) {
      setCurrentMessage("");
      return;
    }

    // If there are alternating messages, handle the switching logic
    if (
      messageResult.hasAlternatingMessages &&
      messageResult.congratsMessage &&
      messageResult.nextOfferMessage
    ) {
      // Check if we've already shown this congrats (using coupon code as unique identifier)
      const couponCode = messageResult.couponCode || "";
      const hasShownThisCongrats = shownCongratsCodes.has(couponCode);

      if (!hasShownThisCongrats && couponCode) {
        // First time hitting this threshold - show congrats
        setCurrentMessage(messageResult.congratsMessage);
        // Mark this coupon code as shown
        setShownCongratsCodes((prev) => new Set(prev).add(couponCode));

        // Switch to next offer message after delay
        const timer = setTimeout(() => {
          setCurrentMessage(messageResult.nextOfferMessage!);
        }, MESSAGE_SWITCH_DELAY);

        return () => clearTimeout(timer);
      } else {
        // Already shown this congrats - skip directly to next offer
        setCurrentMessage(messageResult.nextOfferMessage);
      }
    } else {
      // No alternating, just show the single message
      setCurrentMessage(messageResult.message);
    }
  }, [
    messageResult.shouldShow,
    messageResult.message,
    messageResult.hasAlternatingMessages,
    messageResult.congratsMessage,
    messageResult.nextOfferMessage,
    messageResult.couponCode,
    MESSAGE_SWITCH_DELAY,
  ]);

  // Check if we should show the component (mobile only)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setShouldShow(width < showBelowWidth);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [showBelowWidth]);

  // Don't render if:
  // 1. Explicitly hidden via settings
  // 2. Should not show on this device size
  // 3. No message to display
  if (
    hideContextualMessage ||
    !shouldShow ||
    !messageResult.shouldShow ||
    !currentMessage
  ) {
    return null;
  }

  return (
    <div
      style={{ bottom: `${bottomOffset}px` }}
      className={`fixed inset-x-0 z-[1100] transition-opacity duration-300 ${settingsClassName} ${className}`}
      data-testid="aqualogica-contextual-message"
    >
      <ContextualMessageBar
        message={currentMessage}
        thresholdProductCount={messageResult.thresholdProductCount}
        dataTestId="aqualogica-contextual-message-text"
        thresholdValue={messageResult.thresholdValue}
        cartValue={cartValue}
      />
    </div>
  );
};
