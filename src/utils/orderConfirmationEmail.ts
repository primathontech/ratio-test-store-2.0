interface SendEmailParams {
  orderId: string;
  orderData: Record<string, unknown>;
  gkAccessToken?: string;
  requestId?: string;
  customerId?: string;
  phone?: string;
}

const pendingOrders = new Set<string>();

export async function sendOrderConfirmationEmail({
  orderId,
  orderData,
  gkAccessToken,
  requestId,
  customerId,
  phone,
}: SendEmailParams): Promise<{ sent: boolean; error?: string }> {
  try {
    if (!orderId) {
      return { sent: false, error: "Missing orderId" };
    }

    if (pendingOrders.has(orderId)) {
      return { sent: false, error: "Email already in progress for this order" };
    }

    pendingOrders.add(orderId);

    const response = await fetch("/api/v1/order/send-confirmation-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        orderData,
        gkAccessToken,
        requestId,
        customerId,
        phone,
      }),
      // keepalive ensures the request survives page navigation
      keepalive: true,
    });

    const result = await response.json().catch(() => ({ success: false }));

    if (!result.success) {
      // eslint-disable-next-line no-console
      console.warn("Order confirmation email not sent:", result.error);
      return { sent: false, error: result.error };
    }

    return { sent: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to send order confirmation email:", error);
    return { sent: false, error: "Network error" };
  } finally {
    pendingOrders.delete(orderId);
  }
}
