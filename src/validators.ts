import { CartItem } from './types';

export interface CartSummary {
  lineItems: string[];
  subtotal: string;
  rawSubtotal: number;
  itemCount: number;
  valid: boolean;
}

export function validateCart(items: CartItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (items.length === 0) {
    errors.push('Cart is empty');
  }
  for (const item of items) {
    if (item.price < 0) errors.push(`${item.name}: price must be positive`);
    if (item.quantity < 1) errors.push(`${item.name}: quantity must be at least 1`);
  }
  return { valid: errors.length === 0, errors };
}
