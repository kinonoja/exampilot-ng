export type PaystackSuccessTransaction = {
  reference?: string;
  trxref?: string;
};

/** Accept only the reference returned by Paystack or fall back to our server-created reference. */
export function getPaystackSuccessReference(
  transaction: PaystackSuccessTransaction,
  initializedReference: string,
) {
  return transaction.reference || transaction.trxref || initializedReference;
}
