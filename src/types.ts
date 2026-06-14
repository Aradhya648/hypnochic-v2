export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface DiscountRule {
  minQuantity: number;
  percentage: number;
  label: string;
}
