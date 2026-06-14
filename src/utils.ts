import { TaxConfig } from './config';

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function calculateDiscount(price: number, rate: number): string {
  const discountCents = price * rate;
  return `$${(discountCents / 100).toFixed(2)}`;
}

export function applyTax(price: number, config: TaxConfig): string {
  const taxAmount = price * config.rate;
  const total = price + taxAmount;
  return `$${(total / 100).toFixed(2)}`;
}
