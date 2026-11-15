/**
 * Merchant-agnostic store contact details.
 *
 * Sourced from environment variables so that switching merchant only requires
 * changing env — no content or UI edits. Any field left unset falls back to the
 * value passed in (e.g. the locale placeholder), which keeps the demo working
 * out of the box.
 *
 * Client-safe: only reads NEXT_PUBLIC_* vars and has no server-only imports, so
 * it can be used from client components.
 */
export interface StoreContact {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export function getStoreContact(fallback: StoreContact = {}): StoreContact {
  return {
    email: process.env.NEXT_PUBLIC_STORE_EMAIL || fallback.email,
    phone: process.env.NEXT_PUBLIC_STORE_PHONE || fallback.phone,
    address: process.env.NEXT_PUBLIC_STORE_ADDRESS || fallback.address,
    hours: process.env.NEXT_PUBLIC_STORE_HOURS || fallback.hours,
  };
}
