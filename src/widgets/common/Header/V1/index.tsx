"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeaderProps, NavItem, NavDropdownGroup } from "../types";

/* ──────────────────────── Navigation Data ──────────────────────── */

const DEFAULT_NAV: NavItem[] = [
  {
    label: "Product",
    href: "/collections/all",
    dropdown: [
      {
        items: [
          { label: "All Products", href: "/collections/all" },
          { label: "New Launches", href: "/collections/new-launches" },
          { label: "Combos", href: "/collections/combos" },
          { label: "Kits", href: "/collections/kits" },
          { label: "Best Sellers", href: "/collections/bestseller" },
          { label: "Tarini X BBlunt", href: "/collections/tarini-range" },
        ],
      },
    ],
  },
  {
    label: "Hair Care",
    href: "/collections/hair-care",
    dropdown: [
      {
        heading: "Product Type",
        items: [
          { label: "Shampoo", href: "/collections/shampoo" },
          { label: "Hair Sprays", href: "/collections/sprays" },
          { label: "Conditioner", href: "/collections/conditioner" },
          { label: "Mask", href: "/collections/hair-mask" },
          { label: "Serum", href: "/collections/serum" },
        ],
      },
      {
        heading: "Shop By Concern",
        items: [
          { label: "Hair fall", href: "/collections/hairfall" },
          { label: "Dry Hair", href: "/collections/dry-hair" },
          { label: "Damaged Hair", href: "/collections/damaged-hair" },
          {
            label: "Smoothening Range",
            href: "/collections/advanced-smoothening",
          },
          { label: "Anti-dandruff", href: "/collections/anti-dandruff" },
          { label: "Curly Hair", href: "/collections/curly-hair" },
          { label: "Shine Range", href: "/collections/intense-shine" },
        ],
      },
    ],
  },
  {
    label: "Hair Colour",
    href: "/collections/hair-colour",
    dropdown: [
      {
        items: [
          { label: "Salon Secret", href: "/collections/salon-secret" },
          { label: "Colour Bundles", href: "/collections/colour-bundles" },
          {
            label: "Hair Colour Shampoo",
            href: "/collections/hair-colour-shampoo",
          },
        ],
      },
    ],
  },
  {
    label: "Hair Styling",
    href: "/collections/hair-styling",
    dropdown: [
      {
        items: [
          { label: "Heat Protection", href: "/collections/heat-protection" },
          { label: "Hair Sprays", href: "/collections/sprays" },
          {
            label: "Styling Appliances",
            href: "https://style.bblunt.com/collections/electronic-devices",
          },
        ],
      },
    ],
  },
  {
    label: "Salon",
    href: "https://bbluntsalons.co.in/salon-locator",
    dropdown: [
      {
        items: [
          {
            label: "Mumbai",
            href: "https://bbluntsalons.co.in/salon-locator",
          },
          {
            label: "Hyderabad",
            href: "https://bbluntsalons.co.in/salon-locator",
          },
          {
            label: "Bangalore",
            href: "https://bbluntsalons.co.in/salon-locator",
          },
          {
            label: "Gurugram",
            href: "https://bbluntsalons.co.in/salon-locator",
          },
          {
            label: "Guwahati",
            href: "https://bbluntsalons.co.in/salon-locator",
          },
          {
            label: "Kolkata",
            href: "https://bbluntsalons.co.in/salon-locator",
          },
        ],
      },
    ],
  },
];

/* ──────────────────────── Inline SVG Icons ──────────────────────── */

const HamburgerIcon = () => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2.00056 2.28571H16.8577C17.1608 2.28571 17.4515 2.16531 17.6658 1.95098C17.8802 1.73665 18.0006 1.44596 18.0006 1.14286C18.0006 0.839753 17.8802 0.549063 17.6658 0.334735C17.4515 0.120408 17.1608 0 16.8577 0H2.00056C1.69745 0 1.40676 0.120408 1.19244 0.334735C0.978109 0.549063 0.857702 0.839753 0.857702 1.14286C0.857702 1.44596 0.978109 1.73665 1.19244 1.95098C1.40676 2.16531 1.69745 2.28571 2.00056 2.28571ZM0.857702 8C0.857702 7.6969 0.978109 7.40621 1.19244 7.19188C1.40676 6.97755 1.69745 6.85714 2.00056 6.85714H22.572C22.8751 6.85714 23.1658 6.97755 23.3801 7.19188C23.5944 7.40621 23.7148 7.6969 23.7148 8C23.7148 8.30311 23.5944 8.59379 23.3801 8.80812C23.1658 9.02245 22.8751 9.14286 22.572 9.14286H2.00056C1.69745 9.14286 1.40676 9.02245 1.19244 8.80812C0.978109 8.59379 0.857702 8.30311 0.857702 8ZM0.857702 14.8571C0.857702 14.554 0.978109 14.2633 1.19244 14.049C1.40676 13.8347 1.69745 13.7143 2.00056 13.7143H12.2863C12.5894 13.7143 12.8801 13.8347 13.0944 14.049C13.3087 14.2633 13.4291 14.554 13.4291 14.8571C13.4291 15.1602 13.3087 15.4509 13.0944 15.6653C12.8801 15.8796 12.5894 16 12.2863 16H2.00056C1.69745 16 1.40676 15.8796 1.19244 15.6653C0.978109 15.4509 0.857702 15.1602 0.857702 14.8571Z"
      fill="currentColor"
    />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="10"
    height="7"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 1.24243L5 6.24243L-2.18557e-07 1.24243L0.8875 0.354932L5 4.46743L9.1125 0.354931L10 1.24243Z"
      fill="currentColor"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M14.065 7.53199C14.065 11.15 11.1357 14.083 7.52225 14.083C3.90879 14.083 0.979492 11.15 0.979492 7.53199C0.979492 3.91395 3.90879 0.980957 7.52225 0.980957C11.1357 0.980957 14.065 3.91395 14.065 7.53199Z"
      fill="white"
    />
    <path
      d="M12.1012 12.2113L14.9997 15.0189M14.065 7.53199C14.065 11.15 11.1357 14.083 7.52225 14.083C3.90879 14.083 0.979492 11.15 0.979492 7.53199C0.979492 3.91395 3.90879 0.980957 7.52225 0.980957C11.1357 0.980957 14.065 3.91395 14.065 7.53199Z"
      stroke="black"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1.49432 0.149612C1.79241 0.149918 2.09715 0.160753 2.26093 0.176956L2.42694 0.205276C2.75277 0.283356 3.0353 0.489126 3.22186 0.758011L3.30682 0.897659L3.31464 0.911331L3.31854 0.926956L3.9162 3.02364L14.8547 3.02559H14.8683V3.02657C15.9851 3.12744 16.7186 4.06166 16.5881 5.16914L16.5861 5.18379L16.5812 5.19844C16.3555 5.8849 16.1575 6.59294 15.9543 7.30391C15.8022 7.83612 15.647 8.36945 15.4758 8.89278L15.299 9.41231C14.9778 10.314 14.4748 10.9095 13.8508 11.2922C13.2305 11.6725 12.5015 11.8355 11.7375 11.8967C10.9739 11.9578 10.1613 11.918 9.37323 11.8811C8.58076 11.8439 7.81316 11.8099 7.11932 11.8801L7.10468 11.882L7.09003 11.8801C5.63666 11.749 4.39656 10.791 3.95233 9.39668C3.6814 8.54686 3.47751 7.62195 3.28632 6.69649C3.09459 5.76843 2.91673 4.84133 2.6955 3.97578C2.59064 3.56556 2.46824 3.15938 2.34686 2.74825C2.23568 2.37164 2.12657 1.99115 2.03339 1.60567C2.00785 1.60482 1.97745 1.60385 1.94257 1.60371C1.82819 1.60326 1.67728 1.60596 1.51874 1.60957C1.36128 1.61316 1.19637 1.61757 1.0578 1.61836C0.92483 1.61912 0.799575 1.61713 0.730652 1.60567C0.339042 1.53994 0.149528 1.20716 0.149597 0.895706C0.14967 0.584293 0.339214 0.252166 0.730652 0.186722C0.892412 0.159588 1.1993 0.149317 1.49432 0.149612Z"
      fill="black"
      stroke="black"
      strokeWidth="0.3"
    />
    <path
      d="M6.36282 12.8823C8.68715 12.6261 8.96859 16.1177 6.7095 16.2935C4.4876 16.4658 4.19763 13.121 6.36282 12.8823Z"
      fill="black"
    />
    <path
      d="M12.0772 12.8823C14.4016 12.6261 14.683 16.1177 12.4239 16.2935C10.202 16.4658 9.91204 13.121 12.0772 12.8823Z"
      fill="black"
    />
  </svg>
);

const AccountIcon = () => (
  <svg
    width="19"
    height="22"
    viewBox="0 0 19 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12.9883 10.6297C14.6192 10.6297 15.6562 11.6758 16.2588 13.034C16.8609 14.3912 17.0346 16.0692 16.9404 17.3602C16.8262 18.9251 15.6393 20.0846 14.1064 20.2167H4.59961C3.85475 20.1125 3.28639 19.8723 2.86133 19.5301C2.4361 19.1877 2.15711 18.7444 1.98633 18.2391C1.64564 17.231 1.73463 15.9707 1.95508 14.746C2.13628 13.7403 2.49726 12.7049 3.10645 11.9237C3.71704 11.1408 4.57762 10.6132 5.75195 10.6297C5.87948 10.6316 6.02185 10.6774 6.16699 10.745C6.31292 10.813 6.46634 10.9056 6.61719 11.0038C6.76786 11.1018 6.91829 11.2071 7.05664 11.3016C7.19578 11.3967 7.32257 11.4807 7.42969 11.5379C8.70668 12.2205 10.1094 12.1907 11.3701 11.4891C11.4755 11.4305 11.5974 11.349 11.7295 11.2577C11.8608 11.1668 12.0025 11.0667 12.1455 10.9745C12.2884 10.8823 12.4345 10.7969 12.5762 10.7342C12.7174 10.6717 12.8577 10.6298 12.9883 10.6297Z"
      fill="black"
      stroke="black"
      strokeWidth="0.1"
      strokeLinejoin="round"
    />
    <path
      d="M4.83691 6.51595C4.61388 2.50638 9.36395 0.235708 12.2656 3.00227C14.012 4.66745 14.107 7.45859 12.5186 9.24544L12.3604 9.41536C9.67966 12.1332 5.04937 10.3371 4.83691 6.51595Z"
      fill="black"
      stroke="black"
      strokeWidth="0.1"
      strokeLinejoin="round"
    />
    <path
      d="M5.65838 11.7626C7.39342 13.0303 9.2169 13.5764 11.2261 12.7941C11.8915 12.535 12.4159 12.1136 13.0301 11.7657C15.053 11.8137 15.6543 14.1892 15.7967 15.8537C15.9391 17.5182 15.84 18.9137 13.9096 19.0939H4.79838C3.97507 19.0365 3.20792 18.5999 2.97181 17.7603C2.77372 17.0569 2.90415 15.7743 3.02796 15.0414C3.27955 13.5562 3.92157 11.8321 5.65794 11.7626H5.65838Z"
      fill="white"
    />
    <path
      d="M8.90598 2.92484C11.8786 2.65586 13.6928 6.16284 11.7385 8.44509C10.2188 10.2194 7.40617 9.88321 6.31756 7.81838C5.22675 5.74862 6.61293 3.13195 8.90598 2.92484Z"
      fill="white"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z"
      fill="currentColor"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="8"
    height="12"
    viewBox="0 0 8 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1.5 1L6.5 6L1.5 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ──────────────────────── Desktop Dropdown ──────────────────────── */

function DesktopNavDropdown({ groups }: { groups: NavDropdownGroup[] }) {
  const isMultiGroup = groups.length > 1;

  return (
    <div
      className={`absolute top-full left-0 z-[3] min-w-[268px] max-w-[300px] bg-[#ffffff] pt-[24px] pb-[24px] pl-[19px] pr-[20px] opacity-0 translate-y-[15px] pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${isMultiGroup ? "min-w-[480px] max-w-[520px] flex gap-[30px]" : ""}`}
      style={{
        boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.12)",
      }}
    >
      {groups.map((group, gi) => (
        <div key={gi} className="flex-1">
          {group.heading && (
            <p className="text-[12px] font-[700] uppercase tracking-[1px] text-[#1d1d1d] mb-[12px]">
              {group.heading}
            </p>
          )}
          <ul className="list-none p-0 m-0 flex flex-col gap-[14px]">
            {group.items.map((item, ii) => (
              <li key={ii}>
                <Link
                  href={item.href}
                  className="text-[14px] leading-[17px] font-[400] text-[#545454] no-underline hover:text-[#1d1d1d] transition-colors duration-200"
                  style={{ fontFamily: "'Gotham', sans-serif" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────── Mobile Drawer ──────────────────────── */

function MobileDrawer({
  isOpen,
  onClose,
  navigation,
}: {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavItem[];
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const toggleExpanded = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[998] bg-[rgba(0,0,0,0.5)] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 z-[999] h-full w-[85%] max-w-[380px] bg-[#ffffff] overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-[15px] py-[12px] border-b border-[rgba(29,29,29,0.12)]">
          <Link href="/" onClick={onClose}>
            <Image
              src="/Header/images/logo.png"
              alt="BBlunt"
              width={100}
              height={30}
              className="w-[100px] h-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-[8px] text-[#1d1d1d]"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="py-[10px]">
          <ul className="list-none p-0 m-0">
            {navigation.map((item, index) => (
              <li key={index} className="border-b border-[rgba(29,29,29,0.06)]">
                {item.dropdown ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-[20px] py-[14px] text-[14px] font-[500] text-[#1d1d1d] bg-transparent"
                      onClick={() => toggleExpanded(index)}
                      aria-expanded={expandedIndex === index}
                      style={{ fontFamily: "'Gotham', sans-serif" }}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon
                        className={`w-[10px] h-[7px] transition-transform duration-200 ${
                          expandedIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {/* Expanded Sub-items */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedIndex === index
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-[20px] pb-[14px]">
                        {item.dropdown.map((group, gi) => (
                          <div key={gi} className="mb-[10px]">
                            {group.heading && (
                              <p className="text-[11px] font-[700] uppercase tracking-[1px] text-[#999999] mb-[8px] mt-[4px]">
                                {group.heading}
                              </p>
                            )}
                            <ul className="list-none p-0 m-0">
                              {group.items.map((subItem, si) => (
                                <li key={si}>
                                  <Link
                                    href={subItem.href}
                                    className="flex items-center justify-between py-[10px] text-[13px] font-[400] text-[#545454] no-underline hover:text-[#1d1d1d]"
                                    onClick={onClose}
                                    style={{
                                      fontFamily: "'Gotham', sans-serif",
                                    }}
                                  >
                                    <span>{subItem.label}</span>
                                    <ChevronRightIcon />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-[20px] py-[14px] text-[14px] font-[500] text-[#1d1d1d] no-underline"
                    onClick={onClose}
                    style={{ fontFamily: "'Gotham', sans-serif" }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

/* ──────────────────────── Main Header V1 ──────────────────────── */

export const V1 = memo(function V1({ data, settings, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navigation = settings?.navigation ?? DEFAULT_NAV;
  const logoSrc = settings?.logoSrc ?? "/Header/images/logo.png";
  const logoAlt = settings?.logoAlt ?? "BBlunt";
  const searchPlaceholder =
    settings?.searchPlaceholder ?? "Search For Conditioner, Shampoo...";
  const cartHref = settings?.cartHref ?? "/cart";
  const accountHref = settings?.accountHref ?? "/account";
  const cartCount = data?.cartCount ?? 0;

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-[20] bg-[rgba(255,255,255,0.6)] backdrop-blur-sm ${className ?? ""}`}
        style={{ fontFamily: "'Gotham', sans-serif" }}
      >
        {/* Inner container with horizontal padding */}
        <div className="w-full max-w-full px-[15px] lg:px-[40px]">
          {/* Flex row: logo | nav | icons */}
          <div className="flex items-center min-h-[60px] lg:min-h-[65px]">
            {/* ---- Mobile Hamburger (visible below lg) ---- */}
            <div className="flex items-center lg:hidden">
              <button
                className="p-[4px] text-[#1d1d1d]"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <HamburgerIcon />
              </button>
            </div>

            {/* ---- Logo ---- */}
            <div className="flex items-center py-[5px] lg:py-[5px] flex-1 justify-center lg:flex-none lg:justify-start">
              <Link href="/" className="block">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={136}
                  height={40}
                  className="w-[100px] h-[30px] lg:w-[136px] lg:h-[40px]"
                  priority
                />
              </Link>
            </div>

            {/* ---- Desktop Navigation (visible from lg) ---- */}
            <nav className="hidden lg:block flex-1 ml-[-16px]">
              <ul className="list-none p-0 m-0 flex items-center justify-center gap-[22px] pl-[62px]">
                {navigation.map((item, index) => (
                  <li
                    key={index}
                    className="relative group flex flex-col justify-center"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-[8px] text-[14px] leading-[17px] font-[400] text-[#1d1d1d] no-underline whitespace-nowrap hover:opacity-70 transition-opacity duration-200"
                      style={{ fontFamily: "'Gotham', sans-serif" }}
                    >
                      <span>{item.label}</span>
                      {item.dropdown && (
                        <ChevronDownIcon className="w-[10px] h-[7px]" />
                      )}
                    </Link>

                    {/* Dropdown */}
                    {item.dropdown && (
                      <DesktopNavDropdown groups={item.dropdown} />
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---- Right Side: Search / Cart / Account ---- */}
            <div className="flex items-center justify-end gap-[19px]">
              {/* Mobile search icon (visible below lg) */}
              <button
                className="lg:hidden p-[4px] text-[#000000]"
                aria-label="Search"
              >
                <SearchIcon />
              </button>

              {/* Desktop search input (visible from lg) */}
              <div className="hidden lg:block relative">
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className={`w-[255px] h-[35px] min-h-[35px] rounded-[4px] border border-[#dddddd] bg-transparent pl-[35px] pr-[60px] pt-[8px] pb-[8px] text-[14px] font-[500] capitalize text-[#1d1d1d] placeholder:text-[#727272] outline-none transition-colors duration-200 ${
                    searchFocused ? "border-[#1d1d1d]" : ""
                  }`}
                  style={{ fontFamily: "'Gotham', sans-serif" }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                {/* Search icon inside input */}
                <div className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M14.065 7.53199C14.065 11.15 11.1357 14.083 7.52225 14.083C3.90879 14.083 0.979492 11.15 0.979492 7.53199C0.979492 3.91395 3.90879 0.980957 7.52225 0.980957C11.1357 0.980957 14.065 3.91395 14.065 7.53199Z"
                      fill="white"
                    />
                    <path
                      d="M12.1012 12.2113L14.9997 15.0189M14.065 7.53199C14.065 11.15 11.1357 14.083 7.52225 14.083C3.90879 14.083 0.979492 11.15 0.979492 7.53199C0.979492 3.91395 3.90879 0.980957 7.52225 0.980957C11.1357 0.980957 14.065 3.91395 14.065 7.53199Z"
                      stroke="#999"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Cart */}
              <Link
                href={cartHref}
                className="relative flex items-center text-[#000000] no-underline hover:opacity-70 transition-opacity duration-200"
                aria-label={`Cart with ${cartCount} items`}
              >
                <CartIcon />
                <span
                  className="absolute -top-[8px] -right-[8px] bg-[#000000] text-[#ffffff] text-[10px] font-[600] leading-[1] w-[16px] h-[16px] flex items-center justify-center rounded-[9999px]"
                  aria-hidden="true"
                >
                  {cartCount}
                </span>
              </Link>

              {/* Account */}
              <Link
                href={accountHref}
                className="hidden lg:flex items-center text-[#1d1d1d] no-underline hover:opacity-70 transition-opacity duration-200"
                aria-label="Account"
              >
                <AccountIcon />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        navigation={navigation}
      />
    </>
  );
});

export { V1 as default };
