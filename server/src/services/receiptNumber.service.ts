import Order from "../models/Order";
import CustomOrder from "../models/CustomOrder";

async function generateUnique(
  prefix: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const year = new Date().getFullYear();
  const base = `${prefix}-${year}-`;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = `${base}${counter.toString().padStart(4, "0")}`;
    if (!(await exists(candidate))) {
      return candidate;
    }
    counter += 1;
  }
}

export async function generateOrderReceiptNumber(): Promise<string> {
  return generateUnique("SKN", async (candidate) => {
    const found = await Order.exists({ receiptNumber: candidate });
    return found !== null;
  });
}

export async function generateCustomOrderReceiptNumber(): Promise<string> {
  return generateUnique("SKN-C", async (candidate) => {
    const found = await CustomOrder.exists({ receiptNumber: candidate });
    return found !== null;
  });
}
