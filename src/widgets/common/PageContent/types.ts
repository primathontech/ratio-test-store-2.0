import { WidgetProps } from "@/widgets/types";

/**
 * A single content block. Used for legal clauses, info sections, and FAQ
 * question/answer pairs alike. `body` may be a single paragraph or an array of
 * paragraphs; `bullets` renders an optional list beneath the body.
 */
export interface PageContentBlock {
  heading?: string;
  body?: string | string[];
  bullets?: string[];
}

/**
 * Optional contact details, rendered as a card (used by the Contact page).
 */
export interface PageContentContact {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

/**
 * PageContent widget settings.
 *
 * This is a generic, merchant-agnostic renderer for static/legal/info pages
 * (privacy, refund, terms, shipping, contact, FAQ, …). All content is supplied
 * via `settings` (typically resolved from locale `t:` keys), so no page-specific
 * widget is ever needed.
 */
export interface PageContentSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;
  /** Small uppercase label above the title (e.g. "Legal", "Help Centre"). */
  eyebrow?: string;
  /** Page title (h1). */
  title?: string;
  /** Intro paragraph beneath the title. */
  subtitle?: string;
  /** "Last updated" date, shown for legal pages. */
  updatedAt?: string;
  /** Optional contact card. */
  contact?: PageContentContact;
  /** Ordered content blocks. */
  sections?: PageContentBlock[];
}

/**
 * PageContent widget data
 */
export interface PageContentData {
  // This widget is content-driven via settings; no dataSources required.
}

/**
 * Props for the PageContent component
 */
export type PageContentProps = WidgetProps<
  PageContentData,
  PageContentSettings
>;
