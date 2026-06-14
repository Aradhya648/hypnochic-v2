import { TaxConfig } from './config';
import { DiscountRule } from './types';

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function calculateDiscount(lineTotal: number, quantity: number, rules: DiscountRule[]): number {
  let applicableRate = 0;
  for (const rule of rules) {
    if (quantity >= rule.minQuantity && rule.percentage > applicableRate) {
      applicableRate = rule.percentage;
    }
  }
  return Math.round(lineTotal * applicableRate);
}

export function applyTax(price: number, taxConfig: TaxConfig): string {
  const taxAmount = price * taxConfig.rate;
  return `$${((price + taxAmount) / 100).toFixed(2)}`;
}
