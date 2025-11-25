export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[];
  stock: number;
  description: string;
  brand: string;
  specs: string[];
  deliveryDays: number;
  isBestSeller?: boolean;
  isPrime?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface Question {
  id: string;
  productId: string;
  userName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
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
