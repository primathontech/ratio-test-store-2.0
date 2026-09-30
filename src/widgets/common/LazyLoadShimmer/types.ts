import { WidgetProps } from "@/widgets/types";

/**
 * LazyLoadShimmer widget settings
 */
export interface LazyLoadShimmerSettings {
  /** Widget variant */
  variant?: string;
  /**
   * Pixel margin used to expand the IntersectionObserver root. A
   * negative value (e.g. -80) requires the shimmer to be a bit
   * *inside* the viewport before the dismiss timer starts, which
   * mirrors the live bblunt.com behavior where the user actually
   * sees the shimmer animate as they scroll onto it.
   */
  rootMarginPx?: number;
  /**
   * Minimum time (ms) the shimmer stays visible after it first
   * enters the viewport. Without this, the placeholder would vanish
   * the same frame it appears -- the user would never see the
   * animation. Defaults to 700ms which lines up with one full sweep
   * of the shimmer gradient.
   */
  minVisibleMs?: number;
}

/**
 * LazyLoadShimmer widget data (static placeholder, no API data needed)
 */
export interface LazyLoadShimmerData {
  // Static placeholder -- no dynamic data
}

/**
 * Props for the LazyLoadShimmer component
 */
export type LazyLoadShimmerProps = WidgetProps<
  LazyLoadShimmerData,
  LazyLoadShimmerSettings
>;
