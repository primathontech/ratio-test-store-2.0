import { WidgetProps } from "@/widgets/types";

export interface FBTProductData {
  id?: string | number;
}

export interface FBTProductResponse {
  data?: FBTProductData;
}

export type FBTData = FBTProductData | FBTProductResponse;

export interface FBTSettings {
  variant?: string;
  title?: string;
}

export type FBTProps = WidgetProps<FBTData, FBTSettings>;
