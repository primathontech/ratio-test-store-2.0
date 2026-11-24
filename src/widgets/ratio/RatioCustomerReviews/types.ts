import { WidgetProps } from "@/widgets/types";
import type {
  CustomerReviewsData,
  CustomerReviewsSettings,
} from "@/widgets/common/CustomerReviews/types";

export type RatioCustomerReviewsData = CustomerReviewsData;
export type RatioCustomerReviewsSettings = CustomerReviewsSettings;

export type RatioCustomerReviewsProps = WidgetProps<
  RatioCustomerReviewsData,
  RatioCustomerReviewsSettings
>;
