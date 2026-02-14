import { WidgetProps } from "../../types";

/**
 * Configuration options for the ProductInfo widget
 */
export interface HomepageShineAcademySectionSettings {
  /**
   * Widget variant
   * @default 'v1'
   */
  variant?: string;

  /**
   * Mobile Image Url
   * @default 'http://image.png'
   */
  mobileSrc: string;

  /**
   * Desktop Image Url
   * @default 'http://image2.png'
   */
  desktopSrc: string;

  /**
   * Logo Image Url
   * @default 'http://image3.png'
   */
  logoSrc: string;

  /**
   * Description
   * @default 'description'
   */
  description: string;
}

export type HomepageShineAcademySectionProps =
  WidgetProps<HomepageShineAcademySectionSettings>;
