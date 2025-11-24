export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  category: string;
  images: string[];
  stock: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: Record<string, CartItem>;
}

export interface Filters {
  query: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  sort: 'default' | 'price-asc' | 'price-desc';
}
