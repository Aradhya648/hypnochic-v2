import { formatPrice, slugify, calculateDiscount } from './utils';
import { validateCart, CartSummary } from './validators';
import { CartItem, DiscountRule } from './types';

const products: CartItem[] = [
  { id: "serum-01", name: "Hypnochic Serum", price: 2999, quantity: 2, category: "skincare" },
  { id: "mask-01", name: "Glow Mask", price: 1499, quantity: 1, category: "skincare" },
  { id: "toner-01", name: "Rose Toner", price: 899, quantity: 3, category: "skincare" },
];

const discountRules: DiscountRule[] = [
  { minQuantity: 2, percentage: 0.1, label: "Bulk 10%" },
  { minQuantity: 5, percentage: 0.2, label: "Bulk 20%" },
];

function checkout(items: CartItem[], rules: DiscountRule[]): CartSummary {
  const validation = validateCart(items);
  if (!validation.valid) {
    throw new Error(`Invalid cart: ${validation.errors.join(", ")}`);
  }

  let subtotal = 0;
  const lineItems: string[] = [];

  for (const item of items) {
    const slug = slugify(item.name);
    const lineTotal = item.price * item.quantity;
    const discount = calculateDiscount(lineTotal, rules);
    subtotal += lineTotal - discount;
    lineItems.push(`${slug}: ${formatPrice(lineTotal)} - ${formatPrice(discount)} discount`);
  }

  return {
    lineItems,
    subtotal: formatPrice(subtotal),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    valid: true,
  };
}

const summary = checkout(products, discountRules);
console.log(summary.lineItems.join("\n"));
console.log(`Subtotal: ${summary.subtotal} (${summary.itemCount} items)`);

// v2
