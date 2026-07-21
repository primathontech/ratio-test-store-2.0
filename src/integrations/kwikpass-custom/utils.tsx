import React from "react";

declare global {
  interface Window {
    handleCustomLogin?: (param: boolean) => void;
  }
}

interface KwikPassLogoProps {
  width?: string;
  height?: string;
  currentColor?: string;
}

export const LogOut = ({ className }: { className?: string }) => (
  <span className={className}>&#128682;</span>
);

export const ShoppingBag = ({ className }: { className?: string }) => (
  <span className={className}>&#128717;&#65039;</span>
);

export const Close = ({ currentColor = "#374151" }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="border border-[#374151] rounded-full w-[23px] h-[23px] md:w-[23px] md:h-[23px] px-[1px] py-[1px]"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke={currentColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * KwikPass logo component for custom platform
 */
export const KwikPassLogo: React.FC<KwikPassLogoProps> = ({
  width = "19",
  height = "22",
  currentColor = "black",
}) => {
  return (
    <img
      src="/ratio/images/static/user_icon.svg"
      alt="User"
      width={width}
      height={height}
      style={{ color: currentColor }}
    />
  );
};

export const fireUserEngagementEvent = () => {
  // Event tracking placeholder
};

/**
 * Shared function to handle KwikPass Custom login
 * @param onClose - Optional callback to close any UI (e.g., drawer, dropdown)
 */
export const handleKwikpassLogin = (onClose?: () => void) => {
  try {
    if (typeof window === "undefined") {
      return;
    }

    // Custom platform login
    if (window.handleCustomLogin) {
      window.handleCustomLogin(false);
      onClose?.();
      fireUserEngagementEvent();
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Placeholder CartStorage - should be replaced with actual implementation
export const getCartToken = () => localStorage.getItem("cart_token") || "";

// Active-session token keys written by the KwikPass SDK.
// Exported so auth-sync and clearKwikpassAuthStorage share one source of truth.
// Source: SDK bundle non-shopify-core-functions.min.js
export const KWIKPASS_TOKEN_KEYS = [
  "KWIKUSERTOKEN",
  "SANDBOXKWIKUSERTOKEN",
  "QAKWIKUSERTOKEN",
  "DEVKWIKUSERTOKEN",
] as const;

/**
 * Clears all auth-related storage entries written by KwikPass.
 * Called from the logout flow to ensure no stale token survives.
 */
export const clearKwikpassAuthStorage = () => {
  const ALL_KEYS = [...KWIKPASS_TOKEN_KEYS, "customerDetails", "GUESTUSERDATA"];
  const SESSION_KEYS = ["gk_access_token", "gkAccessToken"];
  const past = "Thu, 01 Jan 1970 00:00:00 GMT";
  try {
    ALL_KEYS.forEach((k) => {
      localStorage.removeItem(k);
      document.cookie = `${k}=; path=/; expires=${past}`;
    });
    SESSION_KEYS.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // Safari Private Browsing throws SecurityError on storage access
  }
};
