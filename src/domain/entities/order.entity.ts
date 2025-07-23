export interface Product {
  product_id: number;
  value: string;
}

export interface Order {
  order_id: number;
  total: string;
  date: string;
  products: Product[];
}
