"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useMenu,
  getRenderStrategy,
  getEffectiveUrl,
  getMegaMenuModel,
  isBrokenLink,
  getAriaLabel,
  type NavItem,
  type MegaMenuColumn,
  type MegaMenuLeaf,
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

/* ── Desktop: a single leaf inside a mega-menu column (normalized model leaf) ──── */
function DesktopLeaf({ leaf }: { leaf: MegaMenuLeaf }) {
  // Image leaf → card; text leaf → link.
  const content = leaf.image ? (
    <>
      {/* Admin-supplied remote image of unknown domain — `unoptimized` so
          next/image doesn't require a per-merchant remotePatterns entry.
          Sizing is controlled by CSS (.sf-mega__card-img). */}
      <Image
        src={leaf.image.src}
        alt={leaf.image.alt_text || leaf.title || ""}
        className="sf-mega__card-img"
        width={400}
        height={400}
        loading="lazy"
        unoptimized
      />
      <span className="sf-mega__card-title">{leaf.title}</span>
    </>
  ) : (
    leaf.title
  );
  const className = leaf.image ? "sf-mega__card" : "sf-mega__link";

  return leaf.isExternal ? (
    <a
      href={leaf.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link href={leaf.href} className={className}>
      {content}
    </Link>
  );
}

/* ── Desktop: a column inside a mega panel (normalized model column) ───────────── */
function DesktopColumn({ column }: { column: MegaMenuColumn }) {
  const cards = column.items.some((l) => !!l.image);
  return (
    <div className="sf-mega__col">
      {column.image?.src && (
        <Image
          src={column.image.src}
          alt={column.image.alt_text || column.title || ""}
          className="sf-mega__col-img"
          width={300}
          height={300}
          loading="lazy"
          unoptimized
        />
      )}
      {/* A column can itself be a link (flat panel): clickable title when it has a
          href, else a plain heading for its leaves. */}
      {column.title &&
        (column.href ? (
          <Link href={column.href} className="sf-mega__col-title">
            {column.title}
          </Link>
        ) : (
          <span className="sf-mega__col-title">{column.title}</span>
        ))}
      <div className={cards ? "sf-mega__cards" : "sf-mega__links"}>
        {column.items.map((leaf) => (
          <DesktopLeaf key={leaf.id} leaf={leaf} />
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
  const linkUrl = getEffectiveUrl(item); // non-null only when this item is itself a link
  const href = linkUrl ?? "/";
  const hasPanel = strategy === "mega-menu" || strategy === "dropdown";
  // Normalized panel model — the single source of shape truth.
  const megaModel = strategy === "mega-menu" ? getMegaMenuModel(item) : null;

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
        // A mega-menu trigger may ALSO be a link (the backend sends a `url` on the
        // trigger when the merchant made it clickable). Render a <Link> when it has
        // one, else a non-navigable label. Hover still opens the panel either way
        // (the <li> mouse handlers above don't depend on this).
        linkUrl ? (
          <Link
            href={linkUrl}
            className="sf-nav__link"
            aria-haspopup="true"
            aria-expanded={open}
          >
            {item.title}
            <span className="sf-nav__chevron" aria-hidden="true">
              ▾
            </span>
          </Link>
        ) : (
          <span
            className="sf-nav__link"
            aria-haspopup="true"
            aria-expanded={open}
          >
            {item.title}
            <span className="sf-nav__chevron" aria-hidden="true">
              ▾
            </span>
          </span>
        )
      ) : (
        <Link href={href} className="sf-nav__link">
          {item.title}
          {strategy === "dropdown" && (
            <span className="sf-nav__chevron" aria-hidden="true">
              ▾
            </span>
          )}
        </Link>
      )}

      {/* Mega-menu panel — pure markup over the normalized model */}
      {strategy === "mega-menu" && open && megaModel && (
        <div className="sf-mega">
          <div className="sf-mega__inner">
            {/* Optional featured/hero image attached to the trigger.
                Leads the panel; restyle position via CSS. */}
            {megaModel.hero?.src && (
              <Image
                src={megaModel.hero.src}
                alt={megaModel.hero.alt_text || item.title || ""}
                className="sf-mega__hero"
                width={300}
                height={300}
                loading="lazy"
                unoptimized
              />
            )}
            {megaModel.columns.map((column) => (
              <DesktopColumn key={column.id} column={column} />
            ))}
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
  if (isBrokenLink(item)) {
    return null;
  }
  const strategy = getRenderStrategy(item);
  const linkUrl = getEffectiveUrl(item); // non-null only when this item is itself a link
  const href = linkUrl ?? "/";
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

  // Flatten the panel to a single level for the drawer. Mega panels use the
  // normalized model (a leaf-less column is itself a link); a plain dropdown
  // flattens its children. Both produce a uniform list of {id, title, href}.
  const children: MegaMenuLeaf[] =
    strategy === "mega-menu"
      ? getMegaMenuModel(item).columns.flatMap((c) =>
          c.items.length > 0
            ? c.items
            : [
                {
                  id: c.id,
                  title: c.title,
                  href: c.href ?? "/",
                  image: c.image,
                  isExternal: false,
                },
              ]
        )
      : (item.items ?? [])
          .filter((c) => !isBrokenLink(c))
          .map((c) => ({
            id: c.id,
            title: c.title,
            href: getEffectiveUrl(c) ?? "/",
            image: null,
            isExternal: false,
          }));

  return (
    <div className="sf-drawer__group">
      {linkUrl ? (
        // Trigger is itself a link: the label navigates, a separate caret expands
        // the sub-items (so mobile users can reach both).
        <div className="sf-drawer__row">
          <Link href={linkUrl} className="sf-drawer__link">
            {item.title}
          </Link>
          <button
            className="sf-drawer__expand"
            aria-label={`${expanded ? "Collapse" : "Expand"} ${item.title}`}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>
        </div>
      ) : (
        <button
          className="sf-drawer__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {item.title}
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      )}
      {expanded && (
        <div className="sf-drawer__sub">
          {children.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              className="sf-drawer__sublink"
            >
              {child.title}
            </Link>
          ))}
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
