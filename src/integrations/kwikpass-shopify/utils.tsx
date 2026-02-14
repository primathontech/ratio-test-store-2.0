import React from "react";

declare global {
  interface Window {
    __KP_LOGIN_SDK_INSTANCE__?: {
      handleKpLogin: () => void;
    };
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
      className="border-2 border-[#840000] rounded-full w-[32px] h-[32px] md:w-[32px] md:h-[32px]"
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
 * KwikPass logo SVG component
 */
export const KwikPassLogo: React.FC<KwikPassLogoProps> = ({
  width = "25",
  height = "25",
  currentColor = "black",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4999 2.08203C6.74679 2.08203 2.08325 6.74557 2.08325 12.4987C2.08325 18.2518 6.74679 22.9154 12.4999 22.9154C18.253 22.9154 22.9166 18.2518 22.9166 12.4987C22.9166 6.74557 18.253 2.08203 12.4999 2.08203Z"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M4.44885 19.1091C4.44885 19.1091 6.77073 16.1445 12.4999 16.1445C18.2291 16.1445 20.552 19.1091 20.552 19.1091"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12.5 12.5C13.3288 12.5 14.1237 12.1708 14.7097 11.5847C15.2958 10.9987 15.625 10.2038 15.625 9.375C15.625 8.5462 15.2958 7.75134 14.7097 7.16529C14.1237 6.57924 13.3288 6.25 12.5 6.25C11.6712 6.25 10.8763 6.57924 10.2903 7.16529C9.70424 7.75134 9.375 8.5462 9.375 9.375C9.375 10.2038 9.70424 10.9987 10.2903 11.5847C10.8763 12.1708 11.6712 12.5 12.5 12.5V12.5Z"
        stroke={currentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export const fireUserEngagementEvent = () => {
  // Event tracking placeholder
};

/**
 * Shared function to handle KwikPass Shopify login
 * @param onClose - Optional callback to close any UI (e.g., drawer, dropdown)
 */
export const handleKwikpassLogin = (onClose?: () => void) => {
  try {
    if (typeof window === "undefined") return;

    // Shopify platform login
    if (window.__KP_LOGIN_SDK_INSTANCE__) {
      window.__KP_LOGIN_SDK_INSTANCE__.handleKpLogin();
      onClose?.();
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Placeholder CartStorage - should be replaced with actual implementation
export const getCartToken = () => localStorage.getItem("cart_token") || "";
