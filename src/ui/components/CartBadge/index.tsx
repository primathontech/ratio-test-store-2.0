"use client";

import { Badge } from "@/ui/atomic";
import { useCartTotalQuantity } from "@shopkit/cart";
import { memo } from "react";

interface CartBadgeProps {
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  size?: {
    width?: string;
    height?: string;
  };
  fontSize?: string;
  backgroundColor?: string;
  textColor?: string;
  fontWeight?: string;
  borderColor?: string;
  borderWidth?: string;
  animate?: boolean;
}

/**
 * CartBadge Component
 *
 * A reusable component that displays the total quantity of all items in the cart.
 * This component is memoized to prevent unnecessary re-renders of parent components.
 * It only re-renders when the cart total quantity changes.
 */
const CartBadge = memo(
  ({
    position = { top: "-8px", right: "-8px" },
    size = { width: "20px", height: "20px" },
    fontSize = "0.75rem",
    backgroundColor,
    textColor,
    fontWeight = "normal",
    borderColor = "#ffffff",
    borderWidth = "1px",
    animate = false,
  }: CartBadgeProps) => {
    const itemCount = useCartTotalQuantity();

    // Don't render anything if cart is empty
    if (itemCount === 0) return null;

    // Provide default values for potentially undefined props
    const bgColor = backgroundColor || "#ff0000";
    const txtColor = textColor || "#ffffff";

    return (
      <Badge
        className="cart-badge"
        style={{
          position: "absolute",
          top: position.top,
          right: position.right,
          bottom: position.bottom,
          left: position.left,
          backgroundColor: bgColor,
          color: txtColor,
          borderRadius: "50%",
          width: size.width,
          height: size.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: fontSize,
          fontWeight: fontWeight,
          padding: 0,
          border: `${borderWidth} solid ${borderColor}`,
          animation: animate ? "pulse 0.5s ease-in-out" : "none",
        }}
      >
        {itemCount > 99 ? "99+" : itemCount}
      </Badge>
    );
  },
);

CartBadge.displayName = "CartBadge";

export { CartBadge };
