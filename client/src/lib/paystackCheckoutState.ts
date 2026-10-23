export function getPaystackCheckoutFailureMessage(error: unknown) {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  if (/declined|not approved|insufficient|do not honor|bank declined/i.test(message)) {
    return "Your payment was not approved. Your plan has not changed. Try another payment method or contact your bank.";
  }
  return "Paystack could not complete checkout. Your plan has not changed. Please try again.";
}

export function getPaystackVerificationFailureMessage() {
  return "We could not verify this payment yet. Your access has not changed. Please try verification again.";
}

export function getPaystackCheckoutStartFailureMessage() {
  return "Secure checkout could not be opened. Your plan has not changed. Please try again.";
}
