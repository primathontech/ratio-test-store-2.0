/**
 * Backwards-compatible thin wrappers over the centralised address service.
 *
 * New code should import directly from `@/services/address.service`.
 */

import {
  AddressApiResponse,
  AddressPayload,
  AddressResponse,
  createAddress as createAddressService,
  deleteCustomerAddress as deleteCustomerAddressService,
  getCustomerAddresses as getCustomerAddressesService,
  updateCustomerAddress as updateCustomerAddressService,
} from "@/services/address.service";
import { CustomerApiResponse } from "./type";

/**
 * Legacy customer-by-phone shape — preserved for the Addresses widget.
 * The widget already resolves the phone separately; returning null here is
 * safer than maintaining a parallel phone-keyed lookup.
 */
export const getCustomerDetails = async (
  _phoneNumber: string
): Promise<CustomerApiResponse | null> => {
  return null;
};

export const getCustomerAddresses = async (
  phoneNumber: string,
  accessToken?: string | null
): Promise<AddressApiResponse | null> => {
  return getCustomerAddressesService(phoneNumber, accessToken);
};

export const updateCustomerAddress = async (
  addressId: string,
  payload: Record<string, unknown>,
  phoneNumber: string,
  accessToken?: string | null
): Promise<AddressApiResponse | null> => {
  return updateCustomerAddressService(
    addressId,
    payload,
    phoneNumber,
    accessToken
  );
};

export const deleteCustomerAddress = async (
  addressId: string,
  accessToken: string
): Promise<AddressApiResponse | null> => {
  return deleteCustomerAddressService(addressId, accessToken);
};

export const createAddress = async (
  payload: AddressPayload,
  customerPhone: string,
  accessToken?: string | null
): Promise<AddressResponse | null> => {
  return createAddressService(payload, customerPhone, accessToken);
};
