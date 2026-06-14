import { formatPrice, slugify, calculateDiscount, applyTax } from './utils';
import { TaxConfig } from './config';

interface Product {
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { name: "Hypnochic Serum", price: 2999, category: "skincare" },
  { name: "Glow Mask", price: 1499, category: "skincare" },
];

const taxConfig: TaxConfig = { rate: 0.08, label: "Sales Tax" };

function displayProducts(items: Product[]): void {
  for (const item of items) {
    const slug = slugify(item.name);
    const display = formatPrice(item.price);
    const discount: string = calculateDiscount(item.price, 0.1);
    const taxed: string = applyTax(item.price, taxConfig);
    console.log(`${slug}: ${display} (save ${discount}, after tax: ${taxed})`);
  }
}

displayProducts(products);
