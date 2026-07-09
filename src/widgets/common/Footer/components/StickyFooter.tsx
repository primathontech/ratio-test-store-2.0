"use client";

import {
  useCartCount,
  useCartStore,
  useCartToggle,
  useCartTotalQuantity,
} from "@shopkit/cart";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@shopkit/core/context";
import { handleKwikpassLogin } from "@/integrations/kwikpass-custom";

import { CartBadge } from "@/ui/components";
import {
  toCartItem,
  type MappableApiProduct,
} from "@/ui/components/CartAwareProductCard";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { resolveAvailableForSale } from "@/ui/components/ProductCard/availability";
import { NAVIGATION_ICONS } from "../constants";
import { MobileNavigationItem } from "../types";

declare global {
  interface Window {
    $chatwoot?: { toggle: () => void };
  }
}

export interface StickyFooterProductData {
  id: string;
  title: string;
  product_type?: string;
  availableForSale?: boolean;
  variants: Array<{
    id: string;
    title?: string;
    price?: number;
    sku?: string;
    availableQuantity?: number;
  }>;
}

interface StickyFooterProps {
  items: MobileNavigationItem[];
  productData?: StickyFooterProductData;
  selectedVariantId?: string;
  addToCartText?: string;
  soldOutText?: string;
}

export const StickyFooter = ({
  items,
  productData,
  selectedVariantId,
  addToCartText = "Add to Cart",
  soldOutText = "Sold Out",
}: StickyFooterProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartCount();
  const totalQuantity = useCartTotalQuantity();
  const isCartInitialized = useCartStore((s) => s.isInitialized);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const cartToken = useCartStore((s) => s.cartToken);
  const addItem = useCartStore((s) => s.addItem);
  const loadingItems = useCartStore((s) => s.loadingItems);
  const toggleCart = useCartToggle();
  const { accessToken } = useAuth();
  const isLoggedIn = !!accessToken;

  const [showGreenTransition, setShowGreenTransition] = useState(false);
  const [showBlackTransition, setShowBlackTransition] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTotalQuantityRef = useRef(totalQuantity);
  const isInitialLoadRef = useRef(true);

  const isProductPage = pathname?.startsWith("/products/") ?? false;

  useEffect(() => {
    if (isCartInitialized && isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevTotalQuantityRef.current = totalQuantity;
    }
  }, [isCartInitialized, totalQuantity]);

  useEffect(() => {
    if (!isCartInitialized) {
      return;
    }

    if (totalQuantity !== prevTotalQuantityRef.current) {
      if (totalQuantity === 0) {
        prevTotalQuantityRef.current = totalQuantity;
        return;
      }

      setIsAnimating(true);
      setShowGreenTransition(false);
      setShowBlackTransition(false);

      const greenTimer = setTimeout(() => {
        setShowGreenTransition(true);
      }, 20);

      const blackTimer = setTimeout(() => {
        setShowBlackTransition(true);
      }, 740);

      const resetTimer = setTimeout(() => {
        setShowGreenTransition(false);
        setShowBlackTransition(false);
        setIsAnimating(false);
      }, 1060);

      prevTotalQuantityRef.current = totalQuantity;

      return () => {
        clearTimeout(greenTimer);
        clearTimeout(blackTimer);
        clearTimeout(resetTimer);
      };
    }
    prevTotalQuantityRef.current = totalQuantity;
  }, [totalQuantity, isCartInitialized]);

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push("/account");
      return;
    }
    handleKwikpassLogin();
  };

  const handleChatClick = () => {
    if (typeof window !== "undefined" && window.$chatwoot) {
      window.$chatwoot.toggle();
    }
  };

  const getActiveTab = (item: MobileNavigationItem) => {
    return (
      (pathname === "/" && item.path === "/") ||
      (!!pathname?.startsWith("/account") && item.path.startsWith("/account"))
    );
  };

  const getTabIcon = (item: MobileNavigationItem, isActive: boolean) => {
    if (item.path === "/") {
      return isActive
        ? NAVIGATION_ICONS.home.active
        : NAVIGATION_ICONS.home.inactive;
    }
    if (item.path.startsWith("/account")) {
      return isActive
        ? NAVIGATION_ICONS.account.active
        : NAVIGATION_ICONS.account.inactive;
    }
    return item.icon;
  };

  const selectedVariant = selectedVariantId
    ? productData?.variants.find((v) => v.id === selectedVariantId)
    : undefined;
  const fallbackVariant =
    productData?.variants.find((v) => v?.title === "Default Title") ||
    productData?.variants[0];
  const activeVariant = selectedVariant || fallbackVariant;
  const priceInPaise = activeVariant?.price ?? 0;
  const currentPrice = priceInPaise / 100;

  const handleAddToCart = async () => {
    if (!productData) {
      return;
    }
    const apiProduct: MappableApiProduct = {
      id: productData.id,
      title: productData.title,
      handle: "",
      product_type: productData.product_type,
      price: priceInPaise,
      variant: activeVariant?.id
        ? { id: activeVariant.id, sku: activeVariant.sku }
        : undefined,
    };
    try {
      await addItem(
        toCartItem(apiProduct, { mainImage: "" } as ProductCardProduct)
      );
    } catch (error) {
      console.error("[StickyFooter] addItem failed:", error);
    }
  };

  const isLoading = productData
    ? !!loadingItems[productData.id] ||
      !!loadingItems[selectedVariantId || productData.variants[0]?.id || ""]
    : false;
  // availableForSale===false → fall back to the active variant's stock
  // quantity (PDP API exposes it per variant) before showing "Sold Out".
  const isAvailable =
    resolveAvailableForSale(
      productData?.availableForSale,
      activeVariant?.availableQuantity
    ) !== false;

  const cartIconColor =
    itemCount > 0
      ? showGreenTransition && !showBlackTransition
        ? "#008000"
        : "#000"
      : "#fff";

  const cartOutlineColor = itemCount > 0 ? "#fff" : "#000";

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {isProductPage && (
        <div
          data-testid="floating-chat-icon"
          className="fixed bottom-[130px] left-[14px] z-50 md:hidden"
        >
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={handleChatClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleChatClick();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="w-[64px] h-[64px] rounded-full overflow-hidden shadow-lg hover:scale-105 active:scale-90 transition-transform duration-300">
              <Image
                src="https://bblunt.com/cdn/shop/files/Comp_2.gif?v=1773657590&width=112"
                alt="Chat"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      <div
        data-testid="sticky-footer-container"
        className="flex gap-[8px] items-center h-[60px]"
      >
        <div
          data-testid="sticky-footer-main-section"
          className="flex-1 rounded-full p-[1px] w-full"
        >
          {isProductPage ? (
            <button
              data-testid="sticky-footer-add-to-cart-button"
              onClick={handleAddToCart}
              disabled={isLoading || !productData || !isAvailable || !cartToken}
              className="md:hidden flex items-center justify-center text-text-lg text-center text-white font-bold px-[42px] py-[17px] w-full rounded-full bg-black disabled:cursor-not-allowed transition-opacity hover:opacity-90"
            >
              {isLoading ? (
                <svg
                  width="18"
                  height="18"
                  className="animate-spin text-white"
                  viewBox="0 0 66 66"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    fill="none"
                    strokeWidth="6"
                    stroke="currentColor"
                    cx="33"
                    cy="33"
                    r="30"
                  />
                  <circle
                    fill="none"
                    strokeWidth="6"
                    stroke="currentColor"
                    cx="33"
                    cy="33"
                    r="30"
                    strokeDasharray="164"
                    strokeDashoffset="120"
                  />
                </svg>
              ) : !isAvailable ? (
                soldOutText
              ) : (
                `${addToCartText} - ₹${currentPrice}`
              )}
            </button>
          ) : (
            <div
              data-testid="sticky-footer-navigation-container"
              className="grid grid-cols-3 pt-[5px] pb-[9px] w-full rounded-full h-[58px]"
              style={{
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                background: "#eeecffb2",
              }}
            >
              {items.map((item) => {
                const isActive = getActiveTab(item);

                if (item.path.startsWith("/account")) {
                  return (
                    <div
                      key={item.id}
                      data-testid={`sticky-footer-nav-item-${item.id}`}
                      className={`${isActive ? "relative" : ""} flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-90`}
                      onClick={handleAccountClick}
                      style={{
                        background: isActive
                          ? "radial-gradient(ellipse 56% 60% at 50% 50%, rgba(255, 207, 51, 0.6) 0%, rgba(255, 207, 51, 0) 100%)"
                          : "transparent",
                      }}
                    >
                      <div
                        data-testid={`sticky-footer-nav-item-icon-${item.id}`}
                        className="flex items-center justify-center w-full h-full"
                      >
                        {getTabIcon(item, isActive)}
                      </div>
                      <span
                        data-testid={`sticky-footer-nav-item-label-${item.id}`}
                        className="text-[12px] font-[600] text-black !leading-none"
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                }

                if (item.path === "/chat" || item.id === "chat") {
                  return (
                    <div
                      key={item.id}
                      data-testid={`sticky-footer-nav-item-${item.id}`}
                      className="flex items-center justify-center cursor-pointer"
                      onClick={handleChatClick}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleChatClick();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div
                        data-testid={`sticky-footer-nav-item-icon-${item.id}`}
                        className="w-[45px] h-[45px] rounded-full overflow-hidden shadow-lg hover:scale-105 active:scale-90 transition-transform duration-300"
                      >
                        <Image
                          src="https://bblunt.com/cdn/shop/files/Comp_2.gif?v=1773657590&width=112"
                          alt="Chat"
                          width={45}
                          height={45}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    data-testid={`sticky-footer-nav-item-${item.id}`}
                    className={`${isActive ? "relative" : ""} flex flex-col items-center justify-center gap-[4px] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-90`}
                    style={{
                      background: isActive
                        ? "radial-gradient(ellipse 56% 60% at 50% 50%, rgba(255, 207, 51, 0.6) 0%, rgba(255, 207, 51, 0) 100%)"
                        : "transparent",
                    }}
                  >
                    <div
                      data-testid={`sticky-footer-nav-item-icon-${item.id}`}
                      className="flex items-center justify-center w-full h-full"
                    >
                      {getTabIcon(item, isActive)}
                    </div>
                    <span
                      data-testid={`sticky-footer-nav-item-label-${item.id}`}
                      className="text-[12px] font-[600] text-black !leading-none"
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div
          data-testid="sticky-footer-cart-wrapper"
          className={`p-[1px] rounded-full overflow-hidden ${isProductPage ? "md:hidden" : ""}`}
        >
          <div
            data-testid="sticky-footer-cart-button"
            onClick={() => void toggleCart()}
            className="relative flex flex-col items-center justify-center w-[59px] h-[59px] px-[10px] rounded-full cursor-pointer hover:scale-105 active:scale-90 overflow-hidden border border-[#ffffff]/30"
            style={{
              backgroundColor:
                itemCount > 0 || isAnimating ? "#000000" : "#eeecffb2",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
            }}
          >
            <div
              data-testid="sticky-footer-cart-green-transition"
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: "#008000",
                transform: showGreenTransition ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: "top",
                transition: showGreenTransition
                  ? "transform 0.5s ease-out"
                  : "none",
              }}
            />
            <div
              data-testid="sticky-footer-cart-black-transition"
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: "#000000",
                transform: showBlackTransition ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: "top",
                transition: showBlackTransition
                  ? "transform 0.3s ease-out"
                  : "none",
              }}
            />
            <div
              data-testid="sticky-footer-cart-icon-container"
              className="flex items-center justify-center"
            >
              <div
                data-testid="sticky-footer-cart-icon-wrapper"
                className={`relative z-10 ${
                  itemCount > 0 || showGreenTransition
                    ? "text-white"
                    : "text-black"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.37857 3.59166L18.1931 3.59463C19.4812 3.71071 20.3247 4.78156 20.1735 6.06432C19.6062 7.78934 19.1794 9.62211 18.5722 11.3275C17.0186 15.6889 12.04 13.9311 8.50482 14.2888C6.76015 14.1317 5.2762 12.9823 4.74464 11.3138C4.0738 9.2096 3.73153 6.72325 3.17557 4.54822C2.91128 3.51428 2.55949 2.50176 2.31722 1.46186C2.25115 1.40472 0.836844 1.49162 0.568982 1.44698C-0.189958 1.3196 -0.189363 0.169579 0.568982 0.0427916C0.93744 -0.0191141 2.04162 -0.00601865 2.4327 0.0326724C2.92854 0.082078 3.36486 0.404107 3.59343 0.834471L4.37916 3.59225L4.37857 3.59166ZM4.73095 5.02204L6.07383 10.7442C6.39169 11.9466 7.43635 12.7853 8.67982 12.8662C10.6382 12.9936 12.7352 12.7674 14.7079 12.8632C15.8121 12.7466 16.7014 12.1168 17.1311 11.0936C17.8014 9.4977 18.1163 7.56017 18.7383 5.92503C18.8842 5.61312 18.5032 5.02204 18.1913 5.02204H4.73095Z"
                    fill={cartOutlineColor}
                  />
                  <path
                    d="M7.57866 15.7277C10.4841 15.4075 10.8359 19.7724 8.012 19.9921C5.23457 20.2076 4.87207 16.0259 7.57866 15.7277ZM7.7108 17.1522C6.95305 17.276 6.95246 18.4319 7.7108 18.5563C8.81737 18.7379 8.81796 16.9712 7.7108 17.1522Z"
                    fill={cartOutlineColor}
                  />
                  <path
                    d="M14.7216 15.7277C17.627 15.4075 17.9788 19.7724 15.1549 19.9921C12.3775 20.2076 12.015 16.0259 14.7216 15.7277ZM14.8537 17.1522C14.096 17.276 14.0954 18.4319 14.8537 18.5563C15.9603 18.7379 15.9609 16.9712 14.8537 17.1522Z"
                    fill={cartOutlineColor}
                  />
                  <path
                    d="M4.73094 5.02197H18.1907C18.5026 5.02197 18.8835 5.61305 18.7377 5.92496C18.1157 7.56011 17.8008 9.49764 17.1305 11.0935C16.7008 12.1173 15.8115 12.7465 14.7073 12.8632C12.734 12.7667 10.6376 12.9935 8.67922 12.8661C7.43575 12.7852 6.39109 11.9465 6.07323 10.7441L4.73035 5.02197H4.73094Z"
                    fill={cartIconColor}
                  />
                  <path
                    d="M7.71075 17.1522C8.81791 16.9712 8.81731 18.7373 7.71075 18.5564C6.9524 18.432 6.953 17.276 7.71075 17.1522Z"
                    fill={cartIconColor}
                  />
                  <path
                    d="M14.8537 17.1522C15.9609 16.9712 15.9603 18.7373 14.8537 18.5564C14.0953 18.432 14.0959 17.276 14.8537 17.1522Z"
                    fill={cartIconColor}
                  />
                </svg>
                {totalQuantity > 0 && (
                  <CartBadge
                    backgroundColor="#F04438"
                    textColor="#fff"
                    position={{ top: "-5px", right: "-5px" }}
                    size={{ width: "16px", height: "16px" }}
                    fontSize="10px"
                  />
                )}
              </div>
            </div>
            <span
              data-testid="sticky-footer-cart-label"
              className={`text-[12px] font-[600] !leading-none relative z-10 ${
                itemCount > 0 || showGreenTransition
                  ? "text-white"
                  : "text-black"
              }`}
            >
              Cart
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
