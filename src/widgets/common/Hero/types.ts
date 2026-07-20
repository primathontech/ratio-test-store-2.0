import { WidgetProps } from "@/widgets/types";
import type { ImageBannerSettings } from "./V1/types";
import type { HeroSettings as HeroV2Settings } from "./V2/types";
import type { HeroVideoSettings } from "./V3/types";
import type { ShoppableHeroSettings } from "./V4/types";

/** V1 (image-banner look) settings. */
export type V1Settings = ImageBannerSettings;
/** V2 (media hero) settings. */
export type V2Settings = HeroV2Settings;
/** V3 (video hero) settings. */
export type V3Settings = HeroVideoSettings;
/** V4 (shoppable hero) settings. */
export type V4Settings = ShoppableHeroSettings;

/** Union of every variant's settings shape. */
export type HeroSettings = V1Settings | V2Settings | V3Settings | V4Settings;

/**
 * Props for the common Hero widget (what the builder passes). The widget's
 * dispatcher builds the HeroVM from these; variants never see them.
 */
export type HeroProps = WidgetProps<Record<string, unknown>, HeroSettings>;
