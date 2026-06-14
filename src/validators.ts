import { CartItem } from './types';

export interface CartSummary {
  lineItems: string[];
  subtotal: string;
  itemCount: number;
  valid: boolean;
}

export function validateCart(items: CartItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const item of items) {
    if (item.quantity <= 0) {
      errors.push(`Item ${item.id} has invalid quantity`);
    }
    if (item.price <= 0) {
      errors.push(`Item ${item.id} has invalid price`);
    }
  }
  return { valid: errors.length === 0, errors };
}
