export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  company: string;
  emailDomain: string | null;
  language: string;

  hasEmailSubscription: boolean;
  hasSmsSubscription: boolean;
  hasPushSubscription: boolean;

  notes: string | null;
  taxSetting: "COLLECT_TAX" | "EXEMPT";
  taxExemptionCards: unknown[] | null;

  anniversaryDate: string | null;

  totalOrders: number;
  totalSpent: string; // amount as string
  averageOrderValue: string;

  firstOrderDate: string | null;
  lastOrderDate: string | null;
  abandonedCheckoutDate: string | null;

  isDeleted: boolean;
  isBlocked: boolean;

  createdAt: string; // ISO date
  updatedAt: string; // ISO date

  defaultAddress: CustomerAddress | null;
}

export interface CustomerAddress {
  id: string;
  customerId: string;

  firstName: string;
  lastName: string;

  address1: string;
  address2: string;

  city: string;
  company: string | null;

  country: string;
  countryCode: string | null;

  province: string;
  provinceCode: string | null;

  zip: string;

  phone: string;
  email: string;

  isDefault: boolean;
  isDeleted: boolean;

  oldId: string;

  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
