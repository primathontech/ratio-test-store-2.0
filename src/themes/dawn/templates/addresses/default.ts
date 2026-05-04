import type { PageConfig } from "@shopkit/builder";
import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

/**
 * Addresses Page Template for dawn
 */
export const template: PageConfig = {
  id: "dawn-addresses",
  dataSources: {},
  sections: [
    // Header Section
    {
      id: "header-section",
      name: "Header",
      type: SECTION_TYPES.HEADER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-header",
          name: "Header",
          type: WIDGET_TYPES.Header,
          settings: { variant: "v1" },
        },
      ],
    },

    // Addresses Content Section
    {
      id: "addresses-content-section",
      name: "Addresses Content",
      type: SECTION_TYPES.CONTENT_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 27, right: 0, bottom: 27, left: 0 } },
          tablet: { padding: { top: 30, right: 0, bottom: 30, left: 0 } },
          desktop: { padding: { top: 36, right: 0, bottom: 36, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-addresses-widget",
          name: "Addresses",
          type: WIDGET_TYPES.Addresses,
          settings: {
            variant: "v1",
            showGetAppBanner: true,
            getAppBannerTitle: "Get the App",
            getAppBannerSubtitle: "To track your order status smoothly",
            getAppButtonText: "Use app",
            getAppButtonUrl: "https://onelink.to/zwhyy8",
            accountDetailsTitle: "Account details",
            greetingText: "Hello",
            logoutText: "Log out",
            notYouText: "not",
            nameLabel: "Name",
            emailLabel: "Email",
            form: {
              first_name: "First name",
              last_name: "Last name",
              company: "Company",
              address1: "Address",
              address2: "Apartment, suite, etc.",
              city: "City",
              country_region: "Country/region",
              select_placeholder: "Select",
              india: "India",
              province: "Province",
              postal_zip_code: "Postal/Zip code",
              phone: "Phone",
              set_as_default: "Set as default address",
              cancel: "Cancel",
            },
            add_address_title: "Add a new address",
            add_address_button: "Add Address",
            adding_address_button: "Adding...",
            edit_address_title: "Edit address",
            save_address_button: "Save",
            saving_address_button: "Saving...",
            update_address_button: "Update",
            updating_address_button: "Updating...",
            list: {
              loading_addresses: "Loading addresses...",
              add_new_address_button: "Add a new address",
              pagination_prev_label: "Previous",
              pagination_next_label: "Next",
              pagination_page_current_prefix: "Page",
              pagination_page_other_prefix: "of",
            },
            card: {
              default_label: "Default",
              edit_button: "Edit",
              delete_button: "Delete",
              deleting_button: "Deleting...",
            },
          },
        },
      ],
    },

    // Footer Section
    {
      id: "footer-section",
      name: "Footer",
      type: SECTION_TYPES.FOOTER_SECTION,
      settings: {
        layout: SECTION_LAYOUT_OPTIONS.FULL,
        responsive: {
          mobile: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          tablet: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
          desktop: { padding: { top: 20, right: 0, bottom: 0, left: 0 } },
        },
      },
      widgets: [
        {
          id: "dawn-footer",
          name: "Footer",
          type: WIDGET_TYPES.Footer,
          settings: { variant: "v1" },
        },
      ],
    },
  ],
};
