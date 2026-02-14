import { WidgetProps } from "@/widgets/types";

export interface ThankYouSettings {
  variant?: "v1";
}

export interface OrderApiResponse {
  order: {
    id: string;
    email?: string;
    status: string;
    line_items: Array<{
      id: string;
      title: string;
      price: string;
      price_set: {
        shop_money: {
          amount: string;
          currency_code: string;
        };
      };
      quantity: number;
      variant_id: string;
      variant_title?: string;
      image?: string;
      sku?: string;
    }>;
    shipping_address?: {
      city: string;
      email: string;
      phone: string;
      state: string;
      address: string;
      last_name: string;
      first_name: string;
      postal_code: string;
    };
    billing_address?: {
      city: string;
      email: string;
      phone: string;
      state: string;
      address: string;
      last_name: string;
      first_name: string;
      postal_code: string;
    };
    currency: string;
    payment_status: string;
    total_price: string;
    subtotal_price: string;
    total_tax: string;
    total_outstanding: string;
    total_discount: string;
    created_at: string;
    updated_at: string;
    name: string;
    order_number: string;
    processed_at?: string;
    fulfillment_status: string;
    shipping_lines: Array<{
      code: string;
      price: number;
      title: string;
    }>;
    discount_applications: any[];
    customer?: any;
  };
}

export interface ThankYouData {
  orderData?: OrderApiResponse;
}

export interface ThankYouProps extends WidgetProps<
  ThankYouData,
  ThankYouSettings
> {}
