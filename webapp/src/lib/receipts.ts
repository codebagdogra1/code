// Receipt-number generators, matching the formats used by the old Netlify functions.

export function generateReceiptNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const timestamp = now.getTime().toString().slice(-6);
  return `CODE-${year}-${timestamp}`;
}

export function generatePaymentReceiptNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const timestamp = now.getTime().toString().slice(-6);
  return `PMT-${year}${month}-${timestamp}`;
}
