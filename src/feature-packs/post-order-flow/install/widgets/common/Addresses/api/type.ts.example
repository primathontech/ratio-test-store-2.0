// API Response interfaces
export interface CustomerApiResponse {
  data: any;
  success: boolean;
  status_code: number;
  timestamp: number;
}

// API Address structure (from backend)
export interface ApiAddress {
  address_id: string;
  address_line1: string | null;
  address_line2: string | null;
  address_type: string;
  recipient_phone: string;
  customerPhone: string;
  city: string;
  state: string;
  country: string;
  address: string;
  pincode: string;
  lat: string | null;
  long: string | null;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
}

export interface AddressApiResponse {
  data?: {
    addresses: ApiAddress[];
    phone: string;
  };
  success: boolean;
  status_code: number;
  timestamp: number;
  error?: {
    message: string;
    type: string;
    code: string;
    reference?: {
      location: string;
      name: string;
      validation: string;
    };
  };
}

// API payload for creating addresses
export interface AddressPayload {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  recipient_phone: string;
  country: string;
  city: string;
  state: string;
  pincode: string;
  address_1: string;
  address_2?: string;
  address: string;
  address_type: string;
}

// API response for address operations
export interface AddressResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}
