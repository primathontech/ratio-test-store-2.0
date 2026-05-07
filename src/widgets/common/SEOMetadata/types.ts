import { WidgetProps } from "../../types";

export interface SEOImage {
  id?: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Settings {
  variant?: string;
  title?: string;
  description?: string;
  canonical?: string;
  image?: SEOImage;
}

export interface Data {}

export type Props = WidgetProps<Data, Settings>;
