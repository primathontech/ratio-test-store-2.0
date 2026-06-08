import { WidgetProps } from "@/widgets/types";
import { AccountData } from "../Account/types";

export interface AddressFormLabels {
  first_name?: string;
  last_name?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  country_region?: string;
  select_placeholder?: string;
  india?: string;
  province?: string;
  postal_zip_code?: string;
  phone?: string;
  set_as_default?: string;
  cancel?: string;
}

export interface AddressCardLabels {
  default_label?: string;
  edit_button?: string;
  delete_button?: string;
  deleting_button?: string;
}

export interface AddressListLabels {
  loading_addresses?: string;
  add_new_address_button?: string;
  pagination_prev_label?: string;
  pagination_next_label?: string;
  pagination_page_current_prefix?: string;
  pagination_page_other_prefix?: string;
}

export interface AddressesSettings {
  variant?: "v1";
  // Sidebar settings
  showGetAppBanner?: boolean;
  getAppBannerIcon?: string;
  getAppBannerTitle?: string;
  getAppBannerSubtitle?: string;
  getAppButtonText?: string;
  getAppButtonUrl?: string;
  // Navigation items
  navigationItems?: NavigationItem[];
  // Translation keys
  greetingText?: string;
  logoutText?: string;
  notYouText?: string;
  nameLabel?: string;
  emailLabel?: string;
  accountDetailsTitle?: string;
  // Form labels (from template / locale)
  form?: AddressFormLabels;
  add_address_title?: string;
  add_address_button?: string;
  adding_address_button?: string;
  edit_address_title?: string;
  save_address_button?: string;
  saving_address_button?: string;
  update_address_button?: string;
  updating_address_button?: string;
  list?: AddressListLabels;
  card?: AddressCardLabels;
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

export interface AddressesData {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  addressesCount?: number;
}

export interface AddressesProps extends WidgetProps<
  AddressesData,
  AddressesSettings
> {
  onAddressListEmptyChange?: (isEmpty: boolean) => void;
}

export interface Address {
  address_id: string;
  first_name: string;
  last_name: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  company?: string;
  isDefault?: boolean;
  pincode?: string;
  recipient_phone?: string;
  address_type?: string;
}

export interface AddressFormData {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressFormProps {
  formData: AddressFormData;
  focusedFields: Set<string>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onFocus: (fieldName: string) => void;
  onBlur: (fieldName: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitButtonText: string;
  title: string;
  /** Form labels from settings (template / locale). Used when passed from parent. */
  formLabels?: AddressFormLabels;
  /** Hide the "Set as default address" checkbox */
  hideDefaultCheckbox?: boolean;
}

export interface AddressCardProps {
  address: Address;
  isDeleting: boolean;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onAddressUpdate?: (updatedAddresses: any[]) => void;
  customerPhone?: string;
  /** Card labels from settings (template / locale) */
  cardLabels?: AddressCardLabels;
}

export interface AddressComponentProps {
  data?: AccountData;
  addresses?: Address[];
  onAddressUpdate?: (updatedAddresses: any[]) => void;
  isInitialLoading?: boolean;
}

export interface ValidationErrors {
  zip?: string;
  phone?: string;
}
