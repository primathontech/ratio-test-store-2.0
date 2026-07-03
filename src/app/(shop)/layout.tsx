import { Chrome } from "@/components/Chrome";

/**
 * Layout for storefront CONTENT pages — wraps them in shared chrome (header/footer)
 * via <Chrome>. Route groups in parens don't change URLs, so /products etc. are
 * unchanged. Pages that must NOT show chrome (e.g. the thank-you page) live OUTSIDE
 * this group, directly under app/, and render with no header/footer.
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Chrome>{children}</Chrome>;
}
