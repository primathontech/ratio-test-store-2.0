// Re-export from the canonical service so widgets and the service share
// a single source of truth.
export type {
  ApiAddress,
  AddressApiResponse,
  AddressPayload,
  AddressResponse,
} from "@/services/address.service";

// Legacy customer-by-phone wrapper shape — kept for the Addresses widget.
export interface CustomerApiResponse {
  data: any;
  success: boolean;
  status_code: number;
  timestamp: number;
}
