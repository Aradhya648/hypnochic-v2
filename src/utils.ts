export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function calculateDiscount(amount: number, rate: number): number {
  return Math.round(amount * rate);
}

export function applyTaxRate(subtotal: number, region: string): { total: number; tax: number } {
  const rates: Record<string, number> = { US: 0.08, EU: 0.2, IN: 0.18 };
  const rate = rates[region] ?? 0;
  const tax = Math.round(subtotal * rate);
  return { total: subtotal + tax, tax };
}
