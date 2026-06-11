import { WidgetProps } from "@/widgets/types";

export interface OrdersSettings {
  variant?: "v1";
  navigationItems?: NavigationItem[];
  greetingText?: string;
  logoutText?: string;
  notYouText?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href: string;
  badge?: string | number;
  isActive?: boolean;
  isLogout?: boolean;
}

export interface OrdersData {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  orders?: Array<{
    id: string;
    orderNumber: string;
    placedOn?: string;
    date?: string;
    paymentStatus?: string;
    deliveryBy?: string;
    total: string;
    orderStatus?: string;
    status?: string;
    items?: Array<{
      title: string;
      quantity: number;
      price: string;
    }>;
  }>;
  addressesCount?: number;
}

export interface OrdersProps extends WidgetProps<OrdersData, OrdersSettings> {}

export interface OrderApiResponse {
  order: {
    id: string;
    email?: string;
    status: string;
    cancel_reason: null | string;
    cancel_reason_text?: null | string;
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
      product_id: string;
      productHandle: string;
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
      address1: string;
      address2: string;
      province: string;
      last_name: string;
      first_name: string;
      postal_code?: string;
      zip?: string;
    };
    billing_address?: {
      city: string;
      email: string;
      phone: string;
      state: string;
      address: string;
      address1: string;
      address2: string;
      province: string;
      last_name: string;
      first_name: string;
      postal_code?: string;
      zip?: string;
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
    other_charges_breakdown?: Array<{
      amount: number;
      label: string;
      type: string;
    }>;
    customer?: any;
    tracking: {
      orderId: string;
      orderNumber: string;
      pickupPincode: string;
      deliveryPincode: string;
      status: string;
      edd: string;
      deliveryPartner: string;
      bufferHours: number;
      createdAt: string;
      updatedAt: string;
      history: any[];
    };
  };
}
