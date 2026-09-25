import { createStorefrontApiClient } from "@shopify/storefront-api-client";

// Get Shopify configuration from environment variables
const getShopifyConfig = () => {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-04";

  if (!domain || !storefrontAccessToken) {
    throw new Error(
      "Missing required Shopify configuration. Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables."
    );
  }

  return { domain, storefrontAccessToken, apiVersion };
};

// Create Shopify Storefront client
const createShopifyClient = () => {
  const config = getShopifyConfig();

  return createStorefrontApiClient({
    storeDomain: config.domain,
    apiVersion: config.apiVersion,
    publicAccessToken: config.storefrontAccessToken,
  });
};

const storefrontClient = createShopifyClient();

export const customerAccessTokenCreate = async (
  email: string,
  password: string
) => {
  try {
    const response = await storefrontClient.request(
      `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
       customerAccessTokenCreate(input: $input) {
         customerAccessToken {
           accessToken
         }
         customerUserErrors {
           message
         }
       }
     }
     `,
      {
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      }
    );

    return response?.data?.customerAccessTokenCreate;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

export const customerAccessTokenCreateWithMultipass = async (
  multipassToken: string
) => {
  try {
    const response = await storefrontClient.request(
      `
       mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
        customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
          customerAccessToken {
            accessToken
          }
          customerUserErrors {
            message
          }
        }
      }
      `,
      {
        variables: {
          multipassToken,
        },
      }
    );

    return response?.data?.customerAccessTokenCreateWithMultipass;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

interface ICustomer {
  shopifyCustomerId: string;
  email: string;
  phone: string;
  state: "ENABLED" | "DISABLED";
  password?: string;
  multipassToken?: string;
}

export const decodeKpToken = async (kpToken: string) => {
  try {
    const response = await fetch("/api/kwikpass-shopify/decode-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kpToken }),
    });

    const result = await response.json();

    if (result.success) {
      return result.data.customer;
    }
    console.error("Failed to decode KwikPass token:", result.error.message);
    return null;
  } catch (error) {
    console.error("Failed to decode KwikPass token:", error);
    return null;
  }
};

export const getCustomerAccessToken = async (customer: ICustomer) => {
  try {
    if (!customer || !customer?.email || !customer?.password) {
      return null;
    }

    const userTokenData = await customerAccessTokenCreate(
      customer.email,
      customer.password
    );

    if (!userTokenData?.customerAccessToken?.accessToken) {
      return null;
    }

    return userTokenData?.customerAccessToken?.accessToken;
  } catch (err) {
    console.error("Error getting customer access token:", err);
    return null;
  }
};

export const getCustomerAccessTokenMultipass = async (customer: ICustomer) => {
  try {
    if (!customer || !customer?.multipassToken) {
      return null;
    }

    const userTokenData = await customerAccessTokenCreateWithMultipass(
      customer.multipassToken
    );

    if (!userTokenData?.customerAccessToken?.accessToken) {
      return null;
    }

    return userTokenData?.customerAccessToken?.accessToken;
  } catch (err) {
    console.error("Error getting customer access token:", err);
    return null;
  }
};
