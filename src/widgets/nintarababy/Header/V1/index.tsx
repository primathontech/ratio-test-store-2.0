"use client";

import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@shopkit/cart";
import { useAuth } from "@shopkit/core/context";
import {
  useNav,
  type NavEntry,
  type MegaMenuColumn,
} from "@shopkit/navigation/client";
import { handleKwikpassLogin } from "@/integrations/kwikpass-custom";
import { NintaraHeaderProps, NavLink, DropdownLink } from "../types";
import { DEFAULT_NAV_LINKS, ICON_PATHS } from "../types";
import { DashboardIcon } from "../icons/DashboardIcon";
import { OrderHistoryIcon } from "../icons/OrderHistoryIcon";
import { LogoutIcon } from "../icons/LogoutIcon";
import "../style.css";

/* =====================================================================
   SVG Icon Components (inline to avoid extra network requests)
   ===================================================================== */

/** Hamburger menu icon (mobile) */
function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.6665 3.33325L13.3332 3.33325"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.6665 8L13.3332 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.6665 12.6667L13.3332 12.6667"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Close icon for drawer */
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 1L1 15m14 0L1 1"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
/** Search magnifier icon (mobile) */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Search submit icon (for desktop form) */
function SearchSubmitIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.03 11.68A5.784 5.784 0 112.85 3.5a5.784 5.784 0 018.18 8.18zm.26 1.12a6.78 6.78 0 11.72-.7l5.4 5.4a.5.5 0 11-.71.7l-5.41-5.4z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Cart icon */
function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.66663 13.3333L13.9334 12.7278C16.2071 12.5383 16.7175 12.0417 16.9695 9.77406L17.5 5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M5 5H18.3333"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle
        cx="5.00004"
        cy="16.6667"
        r="1.66667"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <circle
        cx="14.1667"
        cy="16.6667"
        r="1.66667"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M6.66667 16.6667L12.5 16.6667"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M1.66663 1.66675H2.47163C3.25886 1.66675 3.94508 2.18724 4.13601 2.92919L6.61539 12.5638C6.74069 13.0507 6.63346 13.5665 6.32349 13.968L5.52674 15.0001"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** WhatsApp icon */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clipPath="url(#wa-clip)">
        <path
          d="M0.682461 15.8088C0.681711 18.4974 1.38971 21.1227 2.73596 23.4366L0.553711 31.3426L8.70771 29.2211C10.963 30.4394 13.4899 31.0777 16.0577 31.0779H16.0645C24.5413 31.0779 31.4417 24.2335 31.4453 15.8208C31.447 11.7443 29.8485 7.911 26.9442 5.02703C24.0405 2.14331 20.1786 0.554351 16.0638 0.55249C7.58596 0.55249 0.686086 7.39652 0.682586 15.8088"
          fill="url(#wa-grad1)"
        />
        <path
          d="M0.13375 15.8035C0.132875 18.5889 0.86625 21.308 2.2605 23.7048L0 31.8942L8.44637 29.6967C10.7736 30.9558 13.3939 31.6196 16.0601 31.6206H16.067C24.848 31.6206 31.9963 24.53 32 15.8162C32.0015 11.5932 30.3455 7.62208 27.3375 4.63479C24.3291 1.64788 20.3291 0.00173643 16.067 0C7.2845 0 0.13725 7.08961 0.13375 15.8035ZM5.16388 23.292L4.8485 22.7953C3.52275 20.7036 2.823 18.2865 2.824 15.8045C2.82675 8.56174 8.76725 2.66915 16.072 2.66915C19.6095 2.67064 22.934 4.03895 25.4345 6.52155C27.9349 9.0044 29.3108 12.3049 29.3099 15.8152C29.3066 23.058 23.366 28.9513 16.067 28.9513H16.0618C13.6851 28.9501 11.3542 28.3168 9.3215 27.12L8.83775 26.8353L3.8255 28.1393L5.16388 23.292Z"
          fill="url(#wa-grad2)"
        />
        <path
          d="M12.0854 9.19662C11.7872 8.53888 11.4733 8.52561 11.1897 8.51407C10.9574 8.50415 10.6919 8.5049 10.4267 8.5049C10.1612 8.5049 9.7298 8.604 9.36518 8.99904C9.00018 9.39445 7.97168 10.35 7.97168 12.2934C7.97168 14.2369 9.3983 16.1152 9.59718 16.379C9.7963 16.6423 12.3513 20.7582 16.3978 22.3415C19.7608 23.6574 20.4452 23.3957 21.1751 23.3297C21.9051 23.264 23.5306 22.3744 23.8622 21.452C24.1941 20.5297 24.1941 19.7391 24.0946 19.5739C23.9951 19.4093 23.7296 19.3105 23.3314 19.113C22.9333 18.9156 20.9759 17.9598 20.6111 17.8279C20.2461 17.6962 19.9807 17.6305 19.7152 18.026C19.4497 18.4209 18.6873 19.3105 18.4549 19.5739C18.2228 19.838 17.9904 19.8708 17.5924 19.6733C17.1941 19.4751 15.9119 19.0584 14.3908 17.7128C13.2073 16.6658 12.4083 15.3727 12.1761 14.9772C11.9438 14.5823 12.1512 14.3682 12.3508 14.1714C12.5297 13.9944 12.7491 13.7101 12.9483 13.4795C13.1468 13.2488 13.2131 13.0842 13.3458 12.8208C13.4787 12.5571 13.4122 12.3264 13.3128 12.1288C13.2131 11.9313 12.4394 9.97764 12.0854 9.19662Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="wa-grad1"
          x1="1545.14"
          y1="3079.56"
          x2="1545.14"
          y2="0.55249"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1FAF38" />
          <stop offset="1" stopColor="#60D669" />
        </linearGradient>
        <linearGradient
          id="wa-grad2"
          x1="1600"
          y1="3189.42"
          x2="1600"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9F9F9" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <clipPath id="wa-clip">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Account/Profile icon (user silhouette) */
function AccountIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id="svgkp"
    >
      <path
        d="M22.9129 12.935L13.7571 23.0474C13.5348 23.2929 13.1284 23.1084 13.1669 22.7794L14.0816 14.9731H10.6991C10.4034 14.9731 10.2484 14.6219 10.4478 14.4035L20.3133 3.59739C20.5589 3.32834 20.9984 3.58134 20.8891 3.92887L18.2354 12.3664H22.6607C22.9557 12.3664 23.1109 12.7163 22.9129 12.935Z"
        fill="#FEA203"
      ></path>
      <path
        id="svgkp-path"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6079 5.35819C16.4805 5.1933 16.3421 5.03582 16.1932 4.8869C15.2702 3.96387 14.0183 3.44531 12.7129 3.44531C11.4075 3.44531 10.1556 3.96387 9.2326 4.8869C8.30957 5.80993 7.79102 7.06183 7.79102 8.36719C7.79102 9.67255 8.30957 10.9244 9.2326 11.8475C9.48368 12.0986 9.75909 12.3197 10.0533 12.5086L11.0235 11.4503C10.7335 11.2914 10.4649 11.0911 10.227 10.8531C9.56766 10.1938 9.19727 9.29959 9.19727 8.36719C9.19727 7.43479 9.56766 6.54057 10.227 5.88127C10.8863 5.22196 11.7805 4.85156 12.7129 4.85156C13.6453 4.85156 14.5395 5.22196 15.1988 5.88127C15.3636 6.04604 15.5103 6.22549 15.6377 6.41654L16.6079 5.35819ZM20.6413 18.6497L19.6746 19.7132C20.1676 20.4122 20.4473 21.2264 20.4473 22.0781V23.8359C20.4473 24.2243 20.7621 24.5391 21.1504 24.5391C21.5387 24.5391 21.8535 24.2243 21.8535 23.8359V22.0781C21.8535 20.7863 21.4016 19.6103 20.6413 18.6497ZM12.3111 17.5078H10.3026C7.27113 17.5078 4.97852 19.6394 4.97852 22.0781V23.8359C4.97852 24.2243 4.66372 24.5391 4.27539 24.5391C3.88707 24.5391 3.57227 24.2243 3.57227 23.8359V22.0781C3.57227 18.6922 6.67684 16.1016 10.3026 16.1016H12.4885L12.3111 17.5078Z"
        fill="currentColor"
        stroke="currentColor"
      ></path>
    </svg>
  );
}

/** Dropdown chevron arrow */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="8"
      height="8"
      viewBox="0 0 19 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.5 1.5L9.5 9.5L17.5 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Right chevron arrow for nested dropdown items */
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="7"
      height="12"
      viewBox="0 0 256 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
    </svg>
  );
}

/* =====================================================================
   Admin mega-menu → NavLink mapping

   Maps the render-ready NavEntry[] from useNav() into the existing
   NavLink/DropdownLink shape this header already renders, so the live
   admin-managed menu drives the nav with ZERO markup/style changes. A
   `mega` panel collapses into the dropdown's 2-level structure: a titled
   column becomes a parent link with its leaves as children; a title-less
   column contributes its leaves as flat dropdown links.
   ===================================================================== */

function megaColumnsToDropdownLinks(columns: MegaMenuColumn[]): DropdownLink[] {
  const out: DropdownLink[] = [];
  for (const col of columns) {
    const children = col.items.map((leaf) => ({
      text: leaf.title ?? "",
      href: leaf.href,
    }));
    if (col.title) {
      out.push({
        text: col.title,
        href: col.href ?? children[0]?.href ?? "#",
        children: children.length > 0 ? children : undefined,
      });
    } else {
      out.push(...children);
    }
  }
  return out;
}

function entriesToNavLinks(entries: NavEntry[]): NavLink[] {
  return entries.map((entry): NavLink => {
    switch (entry.kind) {
      case "link":
      case "external":
        return { text: entry.label, href: entry.href, hasDropdown: false };
      case "dropdown": {
        const dropdownLinks = entry.items.map((leaf) => ({
          text: leaf.title ?? "",
          href: leaf.href,
        }));
        return {
          text: entry.label,
          href: entry.href ?? "#",
          hasDropdown: dropdownLinks.length > 0,
          dropdownLinks,
        };
      }
      case "mega": {
        const dropdownLinks = megaColumnsToDropdownLinks(entry.panel.columns);
        return {
          text: entry.label,
          href: entry.href ?? "#",
          hasDropdown: dropdownLinks.length > 0,
          dropdownLinks,
        };
      }
    }
  });
}

/* =====================================================================
   Main V1 Component
   ===================================================================== */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: NintaraHeaderProps) {
  // Build navLinks from API collections data, settings, or fallback to defaults.
  // API data shape: { data: [{ title, handle, products?, ... }] }
  // Parent collections (Baby Care, Mom Care, Essentials) get their products as dropdown children.
  const rawData = data as Record<string, unknown> | undefined;
  const apiCollections = Array.isArray((rawData as any)?.data)
    ? ((rawData as any).data as Array<Record<string, any>>)
    : null;

  // Live admin-managed menu (useNav) is the PRIMARY source; the collection-
  // metadata / settings / defaults chain below is the graceful fallback used
  // when no menu is published (useNav returns []).
  const navEntries = useNav(settings?.menuHandle ?? "main-menu");
  const fallbackNavLinks = React.useMemo(() => {
    // If API collections data is available, build nav from metadata fields:
    //   - show_on_top_nav:                          include at the top level
    //     (admin-controlled — only collections with this toggle ON appear)
    //   - show_dropdown_in_header:                  render subcollections as a
    //     dropdown.
    //   - subcollections:                            list of child collection refs ({ id, handle })
    if (apiCollections && apiCollections.length > 0) {
      const collectionByHandle = new Map(
        apiCollections.map((c) => [c.handle, c])
      );

      const getMetaValue = (col: Record<string, any>, key: string) =>
        col?.metadata?.[key]?.value;

      // Only include collections explicitly flagged "Show on Top Nav" in admin.
      // Creating a new collection no longer auto-adds it to the top nav.
      const topLevel = apiCollections.filter(
        (col) => getMetaValue(col, "show_on_top_nav") === true
      );

      // Sort by metadata.display_order (numeric, may arrive as string).
      // Items without a valid order fall to the end, preserving API order.
      const orderOf = (col: Record<string, any>): number => {
        const raw = getMetaValue(col, "display_order");
        const n = typeof raw === "number" ? raw : parseFloat(raw);
        return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
      };
      topLevel.sort((a, b) => {
        const diff = orderOf(a) - orderOf(b);
        if (diff !== 0) {
          return diff;
        }
        return apiCollections.indexOf(a) - apiCollections.indexOf(b);
      });

      const dropdownMetaKey =
        process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT === "production"
          ? "show_dropdown_in_header"
          : "show_dropdown_in_header";

      return topLevel.map((col) => {
        const showDropdown = getMetaValue(col, dropdownMetaKey) === true;
        const subs = getMetaValue(col, "subcollections");

        let dropdownLinks: DropdownLink[] | undefined;
        if (showDropdown && Array.isArray(subs) && subs.length > 0) {
          dropdownLinks = subs
            .map((sub: { handle?: string }) => {
              if (!sub?.handle) {
                return null;
              }
              const childCol = collectionByHandle.get(sub.handle);
              if (!childCol) {
                return null;
              }
              return {
                text: childCol.title,
                href: `/collections/${sub.handle}`,
              } as DropdownLink;
            })
            .filter((x): x is DropdownLink => x !== null);
        }

        return {
          text: col.title,
          href: `/collections/${col.handle}`,
          hasDropdown: !!dropdownLinks && dropdownLinks.length > 0,
          dropdownLinks,
        } as NavLink;
      });
    }

    // Fallback: use settings or defaults
    const settingsLinks = settings?.navLinks;
    const settingsDropdown = settings?.dropdownItems;

    if (!Array.isArray(settingsLinks) || settingsLinks.length === 0) {
      return data?.navLinks ?? DEFAULT_NAV_LINKS;
    }

    // Build a lookup of default dropdown children by href for 3rd-level inheritance
    const defaultChildrenByHref = new Map<string, DropdownLink["children"]>();
    for (const nav of DEFAULT_NAV_LINKS) {
      if (nav.dropdownLinks) {
        for (const dl of nav.dropdownLinks) {
          if (dl.children && dl.children.length > 0) {
            defaultChildrenByHref.set(dl.href, dl.children);
          }
        }
      }
    }

    // Group dropdownItems by category (nav item text)
    const dropdownByCategory = new Map<string, DropdownLink[]>();
    if (Array.isArray(settingsDropdown) && settingsDropdown.length > 0) {
      for (const item of settingsDropdown) {
        const cat = item.category;
        if (!dropdownByCategory.has(cat)) {
          dropdownByCategory.set(cat, []);
        }
        const dropdownLink: DropdownLink = {
          text: item.text,
          href: item.href,
          children: defaultChildrenByHref.get(item.href),
        };
        dropdownByCategory.get(cat)!.push(dropdownLink);
      }
    }

    const defaultByHref = new Map(
      DEFAULT_NAV_LINKS.map((link) => [link.href, link])
    );

    return settingsLinks.map((flat) => {
      const match = defaultByHref.get(flat.href);
      const categoryDropdown = dropdownByCategory.get(flat.text);
      if (categoryDropdown && categoryDropdown.length > 0) {
        return {
          text: flat.text,
          href: flat.href,
          hasDropdown: true,
          dropdownLinks: categoryDropdown,
          hasBadge: match?.hasBadge,
          badgeText: match?.badgeText,
        } as NavLink;
      }
      if (match) {
        return { ...match, text: flat.text, href: flat.href };
      }
      return {
        text: flat.text,
        href: flat.href,
        hasDropdown: false,
      } as NavLink;
    });
  }, [
    apiCollections,
    settings?.navLinks,
    settings?.dropdownItems,
    data?.navLinks,
  ]);

  const liveNavLinks = entriesToNavLinks(navEntries);
  const navLinks = liveNavLinks.length > 0 ? liveNavLinks : fallbackNavLinks;

  const logoAlt = data?.logoAlt ?? "TheMomsCo";
  const logoHref = data?.logoHref ?? "/";
  const logoSrc = settings?.logoPath ?? ICON_PATHS.logo;
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [logoSrc]);
  const cartCount = useCartStore((s) => s.items?.length ?? 0);
  const openCart = useCartStore((s) => s.openCart);
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, logout } = useAuth();

  const isSticky = settings?.isSticky ?? true;
  const hideOnScrollDown = settings?.hideOnScrollDown ?? true;
  const searchPlaceholder =
    settings?.searchPlaceholder ?? "Search for Products";
  const whatsappHref = settings?.whatsappHref ?? "https://wa.me/8422873121";

  /* ---- Sticky header logic ---- */
  const [isHidden, setIsHidden] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSticky) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 150;

      if (currentScrollY > headerHeight) {
        // Past the header — sticky is active
        setIsStuck(true);

        if (hideOnScrollDown && currentScrollY > lastScrollY.current + 5) {
          setIsHidden(true);
        } else if (currentScrollY < lastScrollY.current - 5) {
          setIsHidden(false);
        }
      } else {
        // Header is still in natural view — no sticky effects
        setIsStuck(false);
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky, hideOnScrollDown]);

  /* ---- Mobile drawer logic ---- */
  const [openDrawerDropdown, setOpenDrawerDropdown] = useState<string | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    document.body.style.overflow = "";
  }, []);

  /* ---- Search state ---- */
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync search input with URL ?q= param (use empty string for SSR to avoid hydration mismatch)
  const [searchQuery, setSearchQuery] = useState("");
  const prevUrlQueryRef = useRef("");

  // Initialize from URL on mount + keep in sync when URL changes
  useEffect(() => {
    const currentUrlQuery =
      new URLSearchParams(window.location.search).get("q") || "";
    if (currentUrlQuery !== prevUrlQueryRef.current) {
      prevUrlQueryRef.current = currentUrlQuery;
      setSearchQuery(currentUrlQuery);
    }
  }, [pathname]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      const trimmed = searchQuery.trim();
      if (trimmed) {
        const url = `/search?q=${encodeURIComponent(trimmed)}`;
        // Replace if already on search page to keep history clean
        if (pathname.startsWith("/search")) {
          router.replace(url);
        } else {
          router.push(url);
        }
      }
    },
    [searchQuery, router, pathname]
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      // Clear any pending debounce
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Auto-navigate after 400ms debounce
      if (query.trim().length > 0) {
        const url = `/search?q=${encodeURIComponent(query.trim())}`;
        searchTimeoutRef.current = setTimeout(() => {
          // Replace if already on search page to avoid stacking history entries
          if (window.location.pathname.startsWith("/search")) {
            router.replace(url);
          } else {
            router.push(url);
          }
        }, 400);
      } else if (pathname.startsWith("/search")) {
        // Navigate back to the previous page when search is cleared
        searchTimeoutRef.current = setTimeout(() => {
          router.back();
        }, 400);
      }
    },
    [router, pathname]
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleSearchSubmit(e as any);
      }
    },
    [handleSearchSubmit]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /* ---- Account dropdown (logged-in overlay) ---- */
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };
    if (isAccountDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAccountDropdownOpen]);

  /* ---- Active nav hover for dropdown ---- */
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavEnter = useCallback((text: string) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setActiveDropdown(text);
  }, []);

  const handleNavLeave = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  // Cleanup nav-dropdown timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) {
        clearTimeout(dropdownTimeout.current);
      }
    };
  }, []);

  return (
    <>
      {/* ============== HEADER ============== */}
      <header
        ref={headerRef}
        className={`nintara-header ${isSticky ? "nintara-header--sticky" : ""} ${isStuck ? "nintara-header--stuck" : ""} ${isHidden ? "nintara-header--hidden" : ""} ${className ?? ""}`}
        role="banner"
        data-testid="momsco-header-container"
      >
        <div className="nintara-header__wrapper">
          {/* ---- ROW 1: Search + Logo + Icons ---- */}
          <div className="nintara-header__row1">
            {/* LEFT (mobile): hamburger + search */}
            <div className="nintara-header__row1-left">
              {/* Hamburger — mobile only */}
              <button
                className="nintara-header__hamburger"
                onClick={openDrawer}
                aria-label="Open navigation menu"
                aria-expanded={isDrawerOpen}
                aria-controls="nintara-mobile-drawer"
                data-testid="momsco-header-mobile-menu-button"
              >
                <HamburgerIcon className="nintara-header__hamburger-icon" />
              </button>

              {/* Mobile search icon — hidden on /search page */}
              {pathname !== "/search" && (
                <Link
                  href="/search"
                  className="nintara-header__mobile-search"
                  aria-label="Go to search"
                  data-testid="momsco-header-search-button"
                >
                  <SearchIcon className="nintara-header__hamburger-icon" />
                </Link>
              )}

              {/* Desktop search form */}
              <div
                className="nintara-header__desktop-search"
                data-testid="momsco-header-search-input-container"
              >
                <form
                  onSubmit={handleSearchSubmit}
                  role="search"
                  className="nintara-header__search-form"
                  data-testid="momsco-header-search-form"
                >
                  <input
                    type="text"
                    name="q"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    className={`nintara-header__search-input ${
                      isSearchFocused
                        ? "nintara-header__search-input--focused"
                        : ""
                    }`}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    data-testid="momsco-header-search-input"
                  />
                  <button
                    type="submit"
                    className="nintara-header__search-submit"
                    aria-label="Submit search"
                    data-testid="momsco-header-search-submit"
                  >
                    <SearchSubmitIcon className="nintara-header__search-submit-icon" />
                  </button>
                </form>
              </div>
            </div>

            {/* CENTER: Logo (absolutely centered on desktop) */}
            <div className="nintara-header__logo-wrap">
              <Link
                href={logoHref}
                className="nintara-header__logo-link"
                data-testid="momsco-header-brand-logo"
              >
                {!logoError ? (
                  <Image
                    src={logoSrc}
                    alt={logoAlt}
                    width={270}
                    height={30}
                    className="w-fit max-w-[180px] h-[65px] xl:h-[80px] py-0.5 lg:py-1.5 "
                    priority
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-lg font-semibold h-[65px] xl:h-[80px] flex items-center">
                    {logoAlt}
                  </span>
                )}
              </Link>
            </div>

            {/* RIGHT: WhatsApp + Account + Cart */}
            <div
              className="nintara-header__row1-right"
              data-testid="momsco-header-right-section"
            >
              {/* WhatsApp — desktop only */}
              {/* <div className="nintara-header__whatsapp">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nintara-header__icon-link"
                  aria-label="Contact us on WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
              </div> */}

              {/* Account/Profile — desktop only */}
              <div
                className="nintara-header__account"
                ref={accountDropdownRef}
                style={{ position: "relative" }}
                data-testid="momsco-header-user-actions-component"
              >
                {accessToken ? (
                  <>
                    <button
                      className="nintara-header__icon-link"
                      aria-label="Account menu"
                      type="button"
                      aria-expanded={isAccountDropdownOpen}
                      aria-haspopup="true"
                      onClick={() => setIsAccountDropdownOpen((prev) => !prev)}
                    >
                      <AccountIcon className="nintara-header__icon-svg nintara-header__account-icon" />
                    </button>
                    {isAccountDropdownOpen && (
                      <div
                        className="nintara-header__account-dropdown"
                        data-testid="momsco-header-user-dropdown"
                      >
                        <div className="nintara-header__account-dropdown-items">
                          <Link
                            href="/account"
                            className="nintara-header__account-dropdown-link"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <DashboardIcon />
                            Your Profile
                          </Link>
                          <Link
                            href="/pages/orders"
                            className="nintara-header__account-dropdown-link"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <OrderHistoryIcon />
                            Order History
                          </Link>
                        </div>
                        <div className="nintara-header__account-dropdown-footer">
                          <button
                            className="nintara-header__account-dropdown-logout"
                            type="button"
                            data-testid="momsco-header-logout-button"
                            onClick={() => {
                              setIsAccountDropdownOpen(false);
                              localStorage.removeItem("customerDetails");
                              logout();
                              if (
                                typeof window !== "undefined" &&
                                (window as any).handleLogout
                              ) {
                                (window as any).handleLogout("/");
                              }
                              window.location.replace("/");
                            }}
                          >
                            Logout
                            <LogoutIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="nintara-header__icon-link"
                    aria-label="Login"
                    type="button"
                    data-testid="momsco-header-login-button"
                    onClick={() => handleKwikpassLogin()}
                  >
                    <AccountIcon className="nintara-header__icon-svg nintara-header__account-icon" />
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                className="nintara-header__icon-link"
                aria-label={`Cart, ${cartCount} items`}
                onClick={openCart}
                type="button"
                data-testid="momsco-header-cart-icon-container"
              >
                <span
                  className="nintara-header__cart-icon-wrap"
                  data-testid="momsco-header-cart-icon"
                >
                  <CartIcon className="nintara-header__icon-svg" />
                  {cartCount > 0 && (
                    <span
                      className="nintara-header__cart-count"
                      data-testid="momsco-header-cart-count"
                    >
                      {cartCount}
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Row 1 border */}
          <div className="nintara-header__row1-border" />

          {/* ---- MOBILE SEARCH BAR (shown on /search page only) ---- */}
          {pathname === "/search" && (
            <div className="nintara-header__mobile-searchbar">
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="nintara-header__mobile-searchbar-form"
              >
                <svg
                  className="nintara-header__mobile-searchbar-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.03 11.68A5.784 5.784 0 112.85 3.5a5.784 5.784 0 018.18 8.18zm.26 1.12a6.78 6.78 0 11.72-.7l5.4 5.4a.5.5 0 11-.71.7l-5.41-5.4z"
                    fill="currentColor"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search for baby products"
                  autoComplete="off"
                  className="nintara-header__mobile-searchbar-input"
                />
              </form>
            </div>
          )}

          {/* ---- ROW 2: Desktop navigation bar ---- */}
          <nav
            className="nintara-header__nav"
            aria-label="Main navigation"
            data-testid="momsco-header-desktop-navigation-wrapper"
          >
            <ul
              className="nintara-header__nav-list"
              data-testid="momsco-header-nav-list"
            >
              {navLinks.map((link, idx) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
                const isNearEnd = idx >= navLinks.length - 3;
                return (
                  <li
                    key={link.text}
                    data-testid={`momsco-header-nav-item-${link.text.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`nintara-header__nav-item ${
                      link.hasDropdown
                        ? "nintara-header__nav-item--has-dropdown"
                        : ""
                    } ${
                      activeDropdown === link.text || isActive
                        ? "nintara-header__nav-item--active"
                        : ""
                    }`}
                    onMouseEnter={
                      link.hasDropdown
                        ? () => handleNavEnter(link.text)
                        : undefined
                    }
                    onMouseLeave={link.hasDropdown ? handleNavLeave : undefined}
                  >
                    <Link href={link.href} className="nintara-header__nav-link">
                      {link.text}
                      {link.hasBadge && (
                        <span className="nintara-header__nav-badge">
                          {link.badgeText}
                        </span>
                      )}
                      {link.hasDropdown && (
                        <ChevronDownIcon className="nintara-header__nav-chevron" />
                      )}
                    </Link>

                    {/* Dropdown submenu with actual items */}
                    {link.hasDropdown && activeDropdown === link.text && (
                      <div
                        className={`nintara-header__dropdown${isNearEnd ? " nintara-header__dropdown--right" : ""}`}
                      >
                        <div className="nintara-header__dropdown-inner">
                          {link.dropdownLinks?.map((dropLink) => (
                            <div
                              key={dropLink.href}
                              className="nintara-header__dropdown-item"
                            >
                              <Link
                                href={dropLink.href}
                                className="nintara-header__dropdown-link"
                              >
                                {dropLink.text}
                                {dropLink.children &&
                                  dropLink.children.length > 0 && (
                                    <ChevronDownIcon className="nintara-header__dropdown-chevron-right" />
                                  )}
                              </Link>
                              {dropLink.children &&
                                dropLink.children.length > 0 && (
                                  <div className="nintara-header__dropdown-sub">
                                    {dropLink.children.map((child) => (
                                      <Link
                                        key={child.href}
                                        href={child.href}
                                        className="nintara-header__dropdown-sublink"
                                      >
                                        {child.text}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* ============== MOBILE DRAWER ============== */}
      {/* Overlay */}
      <div
        className={`nintara-header__overlay ${
          isDrawerOpen ? "nintara-header__overlay--visible" : ""
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
        data-testid="momsco-header-mobile-drawer-backdrop"
      />

      {/* Drawer */}
      <div
        id="nintara-mobile-drawer"
        className={`nintara-header__drawer ${
          isDrawerOpen ? "nintara-header__drawer--open" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        // @ts-expect-error inert is valid HTML but not typed in React 18
        inert={!isDrawerOpen ? "" : undefined}
        data-testid="momsco-header-mobile-drawer"
      >
        <div className="nintara-header__drawer-header">
          <button
            onClick={closeDrawer}
            className="nintara-header__drawer-close"
            aria-label="Close navigation menu"
            data-testid="momsco-header-mobile-drawer-close"
          >
            <CloseIcon />
          </button>
        </div>

        <nav
          className="nintara-header__drawer-nav"
          aria-label="Mobile navigation"
        >
          <ul className="nintara-header__drawer-list">
            {navLinks.map((link) => (
              <li key={link.text} className="nintara-header__drawer-item">
                {link.hasDropdown ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Link
                        href={link.href}
                        className="nintara-header__drawer-link"
                        onClick={closeDrawer}
                      >
                        {link.text}
                      </Link>
                      <button
                        type="button"
                        className="p-2 flex-1 mr-1"
                        aria-label={`Toggle ${link.text} submenu`}
                        onClick={() =>
                          setOpenDrawerDropdown((prev) =>
                            prev === link.text ? null : link.text
                          )
                        }
                      >
                        <ChevronDownIcon
                          className={`nintara-header__drawer-chevron mr-5 transition-transform ${
                            openDrawerDropdown === link.text ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {openDrawerDropdown === link.text && link.dropdownLinks && (
                      <ul className="pl-4 mt-1 flex flex-col gap-1">
                        {link.dropdownLinks.map((dropLink) => (
                          <li key={dropLink.href}>
                            <Link
                              href={dropLink.href}
                              className="nintara-header__drawer-link text-sm"
                              onClick={closeDrawer}
                            >
                              {dropLink.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="nintara-header__drawer-link"
                    onClick={closeDrawer}
                  >
                    {link.text}
                    {link.hasBadge && (
                      <span className="nintara-header__drawer-badge">
                        {link.badgeText}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
});

export { V1 as default };
