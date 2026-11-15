import { Chrome } from "@/components/Chrome";
import { ArmScope } from "@/bootstrap/ab/ArmSync";

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
  return (
    <>
      {/* Clears A/B reporting on pages that are in no test — see ArmScope. */}
      <ArmScope />
      <Chrome>
        {/* Primary landmark for assistive tech + skip-link target (see root
            layout). Non-visual wrapper — block-level like the previous fragment. */}
        <main id="main-content">{children}</main>
      </Chrome>
    </>
  );
}
