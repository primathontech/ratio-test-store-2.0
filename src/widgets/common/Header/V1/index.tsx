"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import {
  useMenu,
  getRenderStrategy,
  getEffectiveUrl,
  getMegaMenuColumns,
  hasImage,
  isBrokenLink,
  getAriaLabel,
  type NavItem,
} from "@shopkit/navigation/client";
import { HeaderProps } from "../types";
import "./style.css";

/**
 * Header V1 — REFERENCE IMPLEMENTATION for the mega menu.
 *
 * This is the canonical pattern every merchant storefront COPIES and RESTYLES.
 * It consumes the live, admin-managed menu from `@shopkit/navigation` and renders
 * it on desktop (nav bar + mega panels) and mobile (slide-in drawer accordion).
 *
 * ── Rules to keep when you restyle (see plans/mega-menu/FLOW.md §4.1) ──────────
 *  1. Import ONLY from "@shopkit/navigation/client" — never the server barrel.
 *  2. Drive each top-level item off getRenderStrategy(item).
 *  3. Decide leaf card-vs-text with hasImage(item) — NEVER resource_type
 *     (the menu data has no commerce fields; a product leaf == any image leaf).
 *  4. Keep a graceful fallback when useMenu() returns null (no env/backend) so the
 *     header is never blank and the editor preview looks fine.
 *
 * The visual design is YOURS — only the data + helpers are shared.
 */

/**
 * Graceful fallback nav — shown when `useMenu()` returns null/empty (no env var,
 * backend down, handle not found, or inside the editor preview iframe where there
 * is no NavigationProvider). Keep SOMETHING here so the header is never blank.
 * Customize these links for your store. (Rule #4 in the header comment.)
 */
const FALLBACK_NAV: { title: string; href: string }[] = [
  { title: "Home", href: "/" },
];

/* ── Desktop: a single depth-2 leaf inside a mega-menu column ─────────────────── */
function DesktopLeaf({ item }: { item: NavItem }) {
  if (isBrokenLink(item)) return null;
  const href = getEffectiveUrl(item) ?? "/";
  // Image leaf → card; text leaf → link. (hasImage, not resource_type.)
  if (hasImage(item)) {
    return (
      <Link href={href} className="sf-mega__card">
        <img
          src={item.image!.src}
          alt={item.image!.alt_text || item.title}
          className="sf-mega__card-img"
          loading="lazy"
        />
        <span className="sf-mega__card-title">{item.title}</span>
      </Link>
    );
  }
  return (
    <Link href={href} className="sf-mega__link">
      {item.title}
    </Link>
  );
}

/* ── Desktop: a depth-1 column inside a mega panel ────────────────────────────── */
function DesktopColumn({ column }: { column: NavItem }) {
  const cards = column.items.some((c) => hasImage(c));
  return (
    <div className="sf-mega__col">
      {column.image?.src && (
        <img
          src={column.image.src}
          alt={column.image.alt_text || column.title}
          className="sf-mega__col-img"
          loading="lazy"
        />
      )}
      {column.title && <span className="sf-mega__col-title">{column.title}</span>}
      <div className={cards ? "sf-mega__cards" : "sf-mega__links"}>
        {column.items.map((leaf) => (
          <DesktopLeaf key={leaf.id} item={leaf} />
        ))}
      </div>
    </div>
  );
}

/* ── Desktop: one top-level nav item (link / external / dropdown / mega-menu) ─── */
function DesktopItem({
  item,
  open,
  onEnter,
  onLeave,
}: {
  item: NavItem;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const strategy = getRenderStrategy(item);
  const href = getEffectiveUrl(item) ?? "/";
  const hasPanel = strategy === "mega-menu" || strategy === "dropdown";

  return (
    <li
      className={`sf-nav__item ${open ? "is-open" : ""}`}
      onMouseEnter={hasPanel ? onEnter : undefined}
      onMouseLeave={hasPanel ? onLeave : undefined}
    >
      {strategy === "external" ? (
        <a
          href={href}
          className="sf-nav__link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={getAriaLabel(item)}
        >
          {item.title}
        </a>
      ) : strategy === "mega-menu" ? (
        <span className="sf-nav__link" aria-haspopup="true" aria-expanded={open}>
          {item.title}
          <span className="sf-nav__chevron" aria-hidden="true">▾</span>
        </span>
      ) : (
        <Link href={href} className="sf-nav__link">
          {item.title}
          {strategy === "dropdown" && (
            <span className="sf-nav__chevron" aria-hidden="true">▾</span>
          )}
        </Link>
      )}

      {/* Mega-menu panel: multi-column */}
      {strategy === "mega-menu" && open && (
        <div className="sf-mega">
          <div className="sf-mega__inner">
            {getMegaMenuColumns(item).map((col) =>
              isBrokenLink(col) ? null : <DesktopColumn key={col.id} column={col} />
            )}
          </div>
        </div>
      )}

      {/* Simple dropdown: a flat list of children */}
      {strategy === "dropdown" && open && (
        <div className="sf-dropdown">
          {item.items.map((child) =>
            isBrokenLink(child) ? null : (
              <Link
                key={child.id}
                href={getEffectiveUrl(child) ?? "/"}
                className="sf-dropdown__link"
              >
                {child.title}
              </Link>
            )
          )}
        </div>
      )}
    </li>
  );
}

/* ── Mobile: one top-level item as an accordion row ───────────────────────────── */
function MobileItem({ item }: { item: NavItem }) {
  const [expanded, setExpanded] = useState(false);
  if (isBrokenLink(item)) return null;
  const strategy = getRenderStrategy(item);
  const href = getEffectiveUrl(item) ?? "/";
  const hasChildren = strategy === "mega-menu" || strategy === "dropdown";

  if (!hasChildren) {
    return strategy === "external" ? (
      <a
        href={href}
        className="sf-drawer__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.title}
      </a>
    ) : (
      <Link href={href} className="sf-drawer__link">
        {item.title}
      </Link>
    );
  }

  // mega-menu columns or dropdown children → flatten one level for mobile.
  const children =
    strategy === "mega-menu"
      ? getMegaMenuColumns(item).flatMap((col) => col.items)
      : item.items;

  return (
    <div className="sf-drawer__group">
      <button
        className="sf-drawer__toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {item.title}
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      {expanded && (
        <div className="sf-drawer__sub">
          {children.map((child) =>
            isBrokenLink(child) ? null : (
              <Link
                key={child.id}
                href={getEffectiveUrl(child) ?? "/"}
                className="sf-drawer__sublink"
              >
                {child.title}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ── The header shell (desktop bar + mobile drawer) ───────────────────────────── */
export const V1 = memo(function V1({ settings }: HeaderProps) {
  const brand = settings?.brandName ?? "Store";
  const menu = useMenu(settings?.menuHandle ?? "main-menu");
  const items = menu?.items ?? [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <header className="sf-header">
      <div className="sf-header__bar">
        <button
          className="sf-header__burger"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          ☰
        </button>

        <Link href="/" className="sf-header__brand">
          {brand}
        </Link>

        {/* Desktop nav — hidden on mobile via CSS */}
        <nav className="sf-nav" aria-label="Main navigation">
          <ul className="sf-nav__list">
            {items.length > 0
              ? items.map((item) => (
                  <DesktopItem
                    key={item.id}
                    item={item}
                    open={openId === item.id}
                    onEnter={() => setOpenId(item.id)}
                    onLeave={() => setOpenId(null)}
                  />
                ))
              : FALLBACK_NAV.map((l) => (
                  <li key={l.href} className="sf-nav__item">
                    <Link href={l.href} className="sf-nav__link">
                      {l.title}
                    </Link>
                  </li>
                ))}
          </ul>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={`sf-drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <button
          className="sf-drawer__close"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
        >
          ×
        </button>
        <nav className="sf-drawer__nav" aria-label="Mobile navigation">
          {items.length > 0
            ? items.map((item) => <MobileItem key={item.id} item={item} />)
            : FALLBACK_NAV.map((l) => (
                <Link key={l.href} href={l.href} className="sf-drawer__link">
                  {l.title}
                </Link>
              ))}
        </nav>
      </div>
      {drawerOpen && (
        <div
          className="sf-header__overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
});

export { V1 as default };
