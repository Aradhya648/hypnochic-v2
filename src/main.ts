import { formatPrice, slugify, calculateDiscount } from './utils';

interface Product {
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { name: "Hypnochic Serum", price: 2999, category: "skincare" },
  { name: "Glow Mask", price: 1499, category: "skincare" },
];

function displayProducts(items: Product[]): void {
  for (const item of items) {
    const slug = slugify(item.name);
    const display = formatPrice(item.price);
    const discount: string = calculateDiscount(item.price, 0.1);
    console.log(`${slug}: ${display} (save ${discount})`);
  }
}

displayProducts(products);
