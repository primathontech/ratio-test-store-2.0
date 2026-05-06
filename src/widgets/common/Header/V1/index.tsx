"use client";

import React, {
  memo,
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCartTotalQuantity, useCartStore } from "@shopkit/cart";
import { HeaderProps, NavItem, NavDropdownGroup } from "../types";
import { CartBadge } from "../components/CartBadge";
import { MobileNavigationDrawer } from "../components/MobileDrawer";
import { DropdownAccordion } from "../components/DropdownAccordion";
import { KwikpassLoginCustom } from "@/integrations/kwikpass-custom";
import { MobileSearchOverlay } from "@/widgets/common/Search/components/MobileSearchOverlay";
import { SearchInputV2 } from "@/widgets/common/Search/components/SearchInputV2";
import { TrendingSearches } from "@/widgets/common/Search/components/TrendingSearches";
import { RecommendedProducts } from "@/widgets/common/Search/components/RecommendedProducts";
import { useDebounce } from "@/hooks/useDebounce";

const SEARCH_RESULTS_ROUTE = "/pages/search";
const OVERLAY_VIEWPORT_BREAKPOINT = 1150;

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
      d="M1.49432 0.149612C1.79241 0.149918 2.09715 0.160753 2.26093 0.176956L2.42694 0.205276C2.75277 0.283356 3.0353 0.489126 3.22186 0.758011L3.30682 0.897659L3.31464 0.911331L3.31854 0.926956L3.9162 3.02364L14.8547 3.02559H14.8683V3.02657C15.9851 3.12744 16.7186 4.06166 16.5881 5.16914L16.5861 5.18379L16.5812 5.19844C16.3555 5.8849 16.1575 6.59294 15.9543 7.30391C15.8022 7.83612 15.647 8.36945 15.4758 8.89278L15.299 9.41231C14.9778 10.314 14.4748 10.9095 13.8508 11.2922C13.2305 11.6725 12.5015 11.8355 11.7375 11.8967C10.9739 11.9578 10.1613 11.918 9.37323 11.8811C8.58076 11.8439 7.81316 11.8099 7.11932 11.8801L7.10468 11.882L7.09003 11.8801C5.63666 11.749 4.39656 10.791 3.95233 9.39668C3.6814 8.54686 3.47751 7.62195 3.28632 6.69649C3.09459 5.76843 2.91673 4.84133 2.6955 3.97578C2.59064 3.56556 2.46824 3.15938 2.34686 2.74825C2.23568 2.37164 2.12657 1.99115 2.03339 1.60567C2.00785 1.60482 1.97745 1.60385 1.94257 1.60371C1.82819 1.60326 1.67728 1.60596 1.51874 1.60957C1.36128 1.61316 1.19637 1.61757 1.0578 1.61836C0.92483 1.61912 0.799575 1.61713 0.730652 1.60567C0.339042 1.53994 0.149528 1.20716 0.149597 0.895706C0.14967 0.584293 0.339214 0.252166 0.730652 0.186722C0.892412 0.159588 1.1993 0.149317 1.49432 0.149612ZM5.30389 8.85664C5.54121 9.75437 6.32108 10.3827 7.25311 10.4436C8.02846 10.494 8.83338 10.4743 9.64667 10.4514C10.4528 10.4286 11.2681 10.402 12.0598 10.4397C12.8872 10.3492 13.5461 9.87909 13.8664 9.11641C14.13 8.48871 14.3253 7.79168 14.5178 7.08028C14.7092 6.37234 14.8985 5.64913 15.1506 4.98653L15.1545 4.97676L15.1662 4.92793C15.1675 4.90721 15.1655 4.88192 15.1594 4.85176C15.1474 4.79284 15.1209 4.72655 15.0822 4.66426C15.0435 4.6019 14.996 4.54945 14.9504 4.51387C14.9029 4.47692 14.8691 4.46797 14.8527 4.46797H4.27362L5.30389 8.85664Z"
      fill="black"
      stroke="black"
      strokeWidth="0.3"
    />
    <path
      d="M6.36282 12.8823C8.68715 12.6261 8.96859 16.1177 6.7095 16.2935C4.4876 16.4658 4.19763 13.121 6.36282 12.8823ZM6.46829 14.022C5.86251 14.1213 5.862 15.0453 6.46829 15.145C7.35354 15.2903 7.35402 13.8772 6.46829 14.022Z"
      fill="black"
    />
    <path
      d="M6.36282 12.8823C8.68715 12.6261 8.96859 16.1177 6.7095 16.2935C4.4876 16.4658 4.19763 13.121 6.36282 12.8823ZM6.46829 14.022C5.86251 14.1213 5.862 15.0453 6.46829 15.145C7.35354 15.2903 7.35402 13.8772 6.46829 14.022Z"
      stroke="black"
    />
    <path
      d="M12.0772 12.8823C14.4016 12.6261 14.683 16.1177 12.4239 16.2935C10.202 16.4658 9.91204 13.121 12.0772 12.8823ZM12.1827 14.022C11.5769 14.1213 11.5764 15.0453 12.1827 15.145C13.068 15.2903 13.0684 13.8772 12.1827 14.022Z"
      fill="black"
    />
    <path
      d="M12.0772 12.8823C14.4016 12.6261 14.683 16.1177 12.4239 16.2935C10.202 16.4658 9.91204 13.121 12.0772 12.8823ZM12.1827 14.022C11.5769 14.1213 11.5764 15.0453 12.1827 15.145C13.068 15.2903 13.0684 13.8772 12.1827 14.022Z"
      stroke="black"
    />
    <path
      d="M4.08474 4.31764H14.8525C15.1021 4.31764 15.4068 4.79051 15.2901 5.04003C14.7925 6.34815 14.5406 7.89817 14.0044 9.17486C13.6606 9.99392 12.9492 10.4973 12.0658 10.5906C10.4872 10.5135 8.81005 10.6949 7.24336 10.593C6.24858 10.5282 5.41285 9.85725 5.15856 8.89533L4.08426 4.31764H4.08474Z"
      fill="white"
    />
    <path
      d="M6.46859 14.0216C7.35432 13.8769 7.35384 15.2897 6.46859 15.145C5.86192 15.0455 5.86239 14.1207 6.46859 14.0216Z"
      fill="white"
    />
    <path
      d="M12.1829 14.0216C13.0687 13.8769 13.0682 15.2897 12.1829 15.145C11.5763 15.0455 11.5767 14.1207 12.1829 14.0216Z"
      fill="white"
    />
  </svg>
);

// AccountIcon was inlined here previously; now lives inside UserAccount.

/* ──────────────────────── Desktop Dropdown ──────────────────────── */

function DesktopNavDropdown({ groups }: { groups: NavDropdownGroup[] }) {
  const hasHeadings = groups.some((g) => g.heading);

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 z-[3] w-[268px] bg-secondary pt-6 pb-[33px] pl-[19px] pr-5 opacity-0 translate-y-[15px] pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
      style={{
        boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.12)",
      }}
    >
      {hasHeadings
        ? /* Nested accordion style (e.g. Hair Care) */
          groups.map((group: any, gi) => (
            <DropdownAccordion
              key={gi}
              group={group}
              className={gi > 0 ? "mt-1" : ""}
            />
          ))
        : /* Flat link list style (e.g. Product, Hair Colour, etc.) */
          groups.map((group, gi) => (
            <div key={gi}>
              <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
                {group.items.map((item, ii) => (
                  <li key={ii}>
                    <Link
                      href={item.href}
                      className="text-sm leading-[16.8px] font-normal text-[#545454] no-underline transition-colors duration-200 hover:text-loading-blue"
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

/* ──────────────────────── Search Input with Typing Animation ──── */

const SEARCH_SUGGESTIONS = [
  "Search for Shampoo",
  "Search for Hair Care",
  "Search for Conditioner",
  "Search for Salon Treatment",
];

function SearchInput({
  focused,
  onFocusChange,
  value,
  onChange,
  onClick,
  onSubmit,
  inputRef: externalInputRef,
}: {
  focused: boolean;
  onFocusChange: (v: boolean) => void;
  value?: string;
  onChange?: (v: string) => void;
  onClick?: () => void;
  onSubmit?: (query: string) => void;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}) {
  const [placeholder, setPlaceholder] = useState("");
  const internalInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = externalInputRef ?? internalInputRef;

  useEffect(() => {
    let suggestionIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = SEARCH_SUGGESTIONS[suggestionIdx];

      if (!isDeleting) {
        charIdx++;
        setPlaceholder(current.substring(0, charIdx));
        if (charIdx >= current.length) {
          // Pause at full text, then start deleting
          timer = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 1500);
          return;
        }
        timer = setTimeout(tick, 80);
      } else {
        charIdx--;
        setPlaceholder(current.substring(0, charIdx));
        if (charIdx <= 0) {
          isDeleting = false;
          suggestionIdx = (suggestionIdx + 1) % SEARCH_SUGGESTIONS.length;
          timer = setTimeout(tick, 300);
          return;
        }
        timer = setTimeout(tick, 40);
      }
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = (value ?? "").trim();
    if (!trimmed) {
      return;
    }
    onSubmit?.(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="relative" role="search">
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        onClick={onClick}
        className="w-[255px] h-[35px] min-h-[35px] rounded bg-transparent pl-[33px] pr-[60px] pt-2 pb-2 text-sm font-medium text-[#727272] placeholder:text-surface outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden"
        style={{
          border: "1px solid #dddddd",
        }}
        onFocus={() => {
          onFocusChange(true);
          onClick?.();
        }}
        onBlur={() => onFocusChange(false)}
      />
      {/* Search icon inside input */}
      <button
        type="submit"
        aria-label="Search"
        className="absolute left-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12.1012 12.2113L14.9997 15.0189M14.065 7.53199C14.065 11.15 11.1357 14.083 7.52225 14.083C3.90879 14.083 0.979492 11.15 0.979492 7.53199C0.979492 3.91395 3.90879 0.980957 7.52225 0.980957C11.1357 0.980957 14.065 3.91395 14.065 7.53199Z"
            stroke="#000000"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  );
}

/* ──────────────────────── Main Header V1 ──────────────────────── */

export const V1 = memo(function V1({ settings, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Initialise from `?q=` so landing on /pages/search?q=bblunt
  // pre-populates the header input. Mirrors how SearchPageWrapper reads the URL.
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);

  // Keep the input in sync with the URL on subsequent navigations
  // (back/forward, programmatic push from elsewhere). Uses the URL as the
  // source of truth — if the URL value matches local state, this is a no-op.
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const desktopSearchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  /* ────── Mobile fullscreen search overlay (ported from V2 reference) ────── */

  // Always start `false` on the server to keep SSR/CSR markup in sync.
  // The real open-state (sessionStorage handshake from SearchInputV2 when the
  // user clears the input, or the `/pages/search` default) is resolved in the
  // post-mount effect below.
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  // After hydration, reconcile with sessionStorage flags + the search route.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const preventOverlay = sessionStorage.getItem("preventSearchOverlayOpen");
      if (preventOverlay === "true") {
        sessionStorage.removeItem("preventSearchOverlayOpen");
        return;
      }
      if (sessionStorage.getItem("openMobileSearchOverlay") === "true") {
        sessionStorage.removeItem("openMobileSearchOverlay");
        setIsSearchOverlayOpen(true);
        return;
      }
    } catch {
      /* ignore */
    }
    if (pathname?.includes(SEARCH_RESULTS_ROUTE)) {
      setIsSearchOverlayOpen(true);
    }
  }, [pathname]);

  // Track the live query inside the overlay's input so the externally
  // rendered (full-width) dropdown can hide once the user starts typing.
  const [overlayQuery, setOverlayQuery] = useState("");

  const closeSearchOverlay = useCallback(() => {
    setIsSearchOverlayOpen(false);
  }, []);

  // Reset the tracked query when the overlay re-opens fresh.
  useEffect(() => {
    if (!isSearchOverlayOpen) {
      setOverlayQuery("");
    }
  }, [isSearchOverlayOpen]);

  // Force-close the desktop dropdown whenever the overlay opens — keeps a
  // single dropdown on screen if a viewport resize moves between desktop and
  // overlay flows mid-session.
  useEffect(() => {
    if (isSearchOverlayOpen) {
      setSearchOpen(false);
    }
  }, [isSearchOverlayOpen]);

  useEffect(() => {
    if (!urlQuery) {
      return;
    }
    let id1 = 0;
    let id2 = 0;
    id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        const el = desktopSearchInputRef.current;
        if (!el) {
          return;
        }
        if (document.activeElement !== el) {
          el.focus();
        }
        const len = el.value.length;
        try {
          el.setSelectionRange(len, len);
        } catch {
          /* ignore */
        }
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [urlQuery]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      setSearchOpen(false);
      setMobileSearchOpen(false);
      router.push(`/pages/search?q=${encodeURIComponent(query)}`);
    },
    [router]
  );

  // Auto-fire search after the user pauses typing (debounced). Mirrors the
  // reference behaviour: each keystroke updates `searchQuery`, but we only
  // navigate once typing settles for `SEARCH_DEBOUNCE_MS`. Pressing Enter
  // bypasses the wait via `handleSearchSubmit` above.
  const SEARCH_DEBOUNCE_MS = 300;
  const debouncedSearchQuery = useDebounce(
    searchQuery.trim(),
    SEARCH_DEBOUNCE_MS
  );
  const lastNavigatedQueryRef = useRef<string>("");

  useEffect(() => {
    if (!debouncedSearchQuery) {
      return;
    }
    if (debouncedSearchQuery === lastNavigatedQueryRef.current) {
      return;
    }
    // If the URL already reflects this query (e.g. the user landed on
    // /pages/search?q=bblunt), record it so we don't do a redundant
    // router.push on mount — but DO still keep the input in sync.
    if (debouncedSearchQuery === urlQuery) {
      lastNavigatedQueryRef.current = debouncedSearchQuery;
      return;
    }
    lastNavigatedQueryRef.current = debouncedSearchQuery;
    setSearchOpen(false);
    setMobileSearchOpen(false);
    router.push(`/pages/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
    // Focus is restored by the urlQuery-keyed useEffect once navigation lands.
  }, [debouncedSearchQuery, urlQuery, router]);

  const navigation = settings?.navigation ?? DEFAULT_NAV;
  const logoSrc = settings?.logoSrc ?? "/Header/images/logo.png";
  const logoAlt = settings?.logoAlt ?? "BBlunt";
  const cartCount = useCartTotalQuantity();
  const openCart = useCartStore((s) => s.openCart);
  const backgroundColor = settings?.backgroundColor ?? "#ffffff";

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const getAppData = {
    app_url: "#",
    logo_url: "https://bblunt.com/cdn/shop/files/bbluntIcon.webp?v=1760440322",
    title: "Get this App",
    description: "For better experience and exclusive features",
    button_text: "Get App",
  };

  const connectWithUsData = [
    { key: "track_order", label: "Track Order", href: "/account" },
    { key: "chat_with_us", label: "Chat with us", href: "#" },
    { key: "need_help", label: "Need help ?", href: "#" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-[20] ${className ?? ""}`}
        style={{
          background:
            backgroundColor === "#ffffff"
              ? "rgb(255 255 255 / .6)"
              : backgroundColor,
          backdropFilter: backgroundColor === "#ffffff" ? "blur(16px)" : "none",
          WebkitBackdropFilter:
            backgroundColor === "#ffffff" ? "blur(16px)" : "none",
        }}
      >
        {/* Inner container: 60px height + 15px padding on mobile/tablet, 65px + 40px on desktop (≥1100px) */}
        <div className="w-full max-w-full flex items-center h-[60px] px-[15px] min-[1100px]:h-[65px] min-[1100px]:px-10">
          {/* ---- Mobile Hamburger (visible below 1100px) ---- */}
          <div className="flex items-center mr-3 min-[1100px]:hidden">
            <button
              className="p-1 text-primary"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <HamburgerIcon />
            </button>
          </div>

          {/* ---- Logo ---- */}
          <div className="flex items-center py-[5px]">
            <Link href="/" className="block">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={136}
                height={40}
                className="w-[87px] h-[26px] md:w-[136px] md:h-10"
                priority
              />
            </Link>
          </div>

          {/* ---- Desktop Navigation (visible from 1100px) ---- */}
          <nav className="hidden min-[1100px]:flex flex-1 h-full">
            <ul className="list-none p-0 m-0 inline-flex items-stretch gap-[22px] min-[1450px]:gap-8 pl-[47px] h-full">
              {navigation.map((item, index) => (
                <li key={index} className="relative group flex items-center">
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-2 text-sm leading-[16.8px] font-bold text-black no-underline whitespace-nowrap after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-px after:bg-black after:origin-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                  >
                    <span>{item.label}</span>
                    {item.dropdown && (
                      <ChevronDownIcon className="w-2.5 h-[7px]" />
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

          {/* Spacer to push icons right when no desktop nav */}
          <div className="flex-1 min-[1100px]:hidden" />

          {/* ---- Right Side: Search / Cart / Account ---- */}
          <div className="flex items-center gap-3.5 xl:gap-[19px]">
            {/* Get App - Only show on mobile, hide on tablet (md and up) */}
            <Link
              data-testid="header-get-app-button"
              href={getAppData?.app_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden transition-all duration-200 ease-in-out flex items-center justify-center px-1.5 py-[3px] max-w-[65px] text-xs font-medium bg-black"
              aria-label={getAppData?.button_text || "Get App"}
              style={{
                color: "#ffffff",
                width: "71px",
                height: "24px",
                borderRadius: "100px",
              }}
            >
              {getAppData?.button_text || "Get App"}
            </Link>

            {/* Mobile/Tablet search icon (visible below 1100px) */}
            <button
              type="button"
              onClick={() => {
                // Below the V2 reference breakpoint → fullscreen overlay.
                // Above (tablet) → existing inline mobile search overlay.
                if (
                  typeof window !== "undefined" &&
                  window.innerWidth < OVERLAY_VIEWPORT_BREAKPOINT
                ) {
                  setIsSearchOverlayOpen(true);
                } else {
                  setMobileSearchOpen(true);
                }
              }}
              className="text-black min-[1100px]:hidden"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* Desktop search input (visible from 1100px).
            <div className="hidden min-[1100px]:block w-[255px]">
              <SearchInputV2
                searchPlaceholder={SEARCH_SUGGESTIONS}
                isMobile={false}
                dropdownTopPosition="48px"
              />
            </div>

            {/* Cart */}
            <button
              type="button"
              onClick={() => {
                void openCart();
              }}
              className="relative flex items-center gap-4 text-black no-underline bg-transparent border-0 p-0 cursor-pointer"
              aria-label={`Cart with ${cartCount} items`}
            >
              <span className="relative">
                <CartIcon />
                <CartBadge count={cartCount} />
              </span>
              {/* "Cart" text: visible on tablet (md: 768px+) */}
              <span className="hidden md:inline text-sm font-normal text-primary">
                Cart
              </span>
            </button>

            {/* Account: triggers KwikPass login when logged out, shows
                dropdown (Profile / Order History / Logout) when logged in. */}
            <div className="hidden md:flex items-center">
              <KwikpassLoginCustom />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavigationDrawer
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        items={navigation.map((item) => ({
          key: item.label.toLowerCase().replace(/\s+/g, "-"),
          label: item.label,
          href: item.href,
          hasDropdown: !!item.dropdown,
          dropdownItems: item.dropdown?.flatMap<{
            key: string;
            label: string;
            href?: string;
            isCategory?: boolean;
            items?: { key: string; label: string; href: string }[];
          }>((group) => {
            if (group.heading) {
              return [
                {
                  key: group.heading.toLowerCase().replace(/\s+/g, "-"),
                  label: group.heading,
                  isCategory: true,
                  items: group.items.map((sub) => ({
                    key: sub.label.toLowerCase().replace(/\s+/g, "-"),
                    label: sub.label,
                    href: sub.href,
                  })),
                },
              ];
            }
            return group.items.map((sub) => ({
              key: sub.label.toLowerCase().replace(/\s+/g, "-"),
              label: sub.label,
              href: sub.href,
            }));
          }),
        }))}
        getApp={getAppData}
        connectWithUs={connectWithUsData}
      />

      {/* Mobile full-screen search overlay (<1100px) */}
      <MobileSearchOverlay
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
        searchRoutePattern="/pages/search?q={q}"
      />

      {/* V2-style fullscreen search overlay (< 1150px). Backdrop + centered
          top panel with SearchInputV2 (typewriter placeholder, debounced
          submit). Trending + recommended panel is rendered separately at
          full viewport width below the input strip. */}
      {isSearchOverlayOpen && (
        <div className="fixed inset-0 z-[22100] xl:hidden">
          {/* Backdrop — closes on outside click */}
          <div
            className="absolute inset-0 z-[22100]"
            aria-hidden="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeSearchOverlay();
              }
            }}
          />

          {/* Top white panel with input + close button (centered, max 600px) */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white w-full max-w-[600px] z-[22101]">
            <div className="flex items-center justify-center px-2.5 pt-4 pb-0 h-[100px]">
              <div className="w-full relative">
                <Suspense
                  fallback={
                    <input
                      type="text"
                      placeholder="Search for products..."
                      disabled
                      className="w-full pl-9 pr-16 py-2 border border-black rounded-md focus:outline-none focus:border-black opacity-50"
                    />
                  }
                >
                  <SearchInputV2
                    searchPlaceholder={[
                      "Search for Shampoo",
                      "Search for Hair Care",
                      "Search for Conditioner",
                      "Search for Salon Treatment",
                    ]}
                    className="w-full border border-[#DDDDDD] bg-white focus:outline-none focus:border-[#DDDDDD]"
                    isMobile={true}
                    onClose={closeSearchOverlay}
                    onQueryChange={setOverlayQuery}
                    disableAutoDropdown={false}
                    forceDropdownOpen={false}
                    renderDropdown={false}
                  />
                </Suspense>
                <button
                  type="button"
                  onClick={closeSearchOverlay}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black flex items-center z-10"
                  aria-label="Close search"
                >
                  <svg
                    className="w-[16px] h-[16px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Full-width dropdown panel below the input strip — only when the
              user hasn't started typing yet. */}
          {!overlayQuery.trim() && (
            <div
              className="absolute left-0 right-0 top-[81px] bg-white z-[22101] overflow-y-auto py-4 px-3 shadow-[0_0_8px_rgba(0,0,0,0.15)]"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <TrendingSearches onClose={closeSearchOverlay} />
              <RecommendedProducts />
            </div>
          )}
        </div>
      )}
    </>
  );
});

export { V1 as default };
