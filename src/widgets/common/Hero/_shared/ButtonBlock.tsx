import type { CSSProperties } from "react";
import Link from "next/link";
import "./blocks.css";

/** Button appearance — matches the `sk-button--{variant}` CSS modifiers. */
export type ButtonVariant = "button" | "button-secondary" | "link";

/** The single shared button class; styles live in blocks.css. */
const BASE_CLASS = "sk-button";

export interface ButtonBlockProps {
  /** Visible label. Renders nothing when empty (callers needn't guard). */
  label?: string;
  /** Link target; falls back to "#". */
  href?: string;
  /** Appearance modifier (primary / secondary / link). Defaults to primary. */
  variant?: ButtonVariant | string;
  open_in_new_tab?: boolean;
  /** Stretch to full width (adds the `--fill` modifier). */
  fill?: boolean;
  style?: CSSProperties;
  /** Forwarded as data-testid when provided. */
  testId?: string;
}

/**
 * ButtonBlock — the single shared CTA link styled as a button (server).
 *
 * Used by the block renderer for the block-system button AND directly by
 * widgets. Every button across the theme renders the same `sk-button` class,
 * so the styling lives in exactly one place (blocks.css) — no per-widget
 * button CSS.
 */
export function ButtonBlock({
  label,
  href,
  variant = "button",
  open_in_new_tab,
  fill,
  style,
  testId,
}: ButtonBlockProps) {
  if (!label) {
    return null;
  }

  const classes = `${BASE_CLASS} ${BASE_CLASS}--${variant}${
    fill ? ` ${BASE_CLASS}--fill` : ""
  }`;

  return (
    <Link
      href={href || "#"}
      className={classes}
      style={style}
      target={open_in_new_tab ? "_blank" : undefined}
      rel={open_in_new_tab ? "noopener noreferrer" : undefined}
      data-testid={testId}
    >
      {label}
    </Link>
  );
}
