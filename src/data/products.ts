import { Product, Review, Question } from '@/types/product';

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Wireless Over-ear Headphones",
    price: 2499.00,
    rating: 4.5,
    reviewCount: 1247,
    category: "Electronics",
    brand: "AudioTech",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80"],
    stock: 15,
    description: "Premium wireless headphones with 30-hour battery life and active noise cancellation. Perfect for music lovers and professionals.",
    specs: ["Active Noise Cancellation", "30-hour battery life", "Bluetooth 5.0", "Foldable design"],
    deliveryDays: 2,
    isBestSeller: true,
    isPrime: true
  },
  {
    id: "p2",
    title: "Portable Bluetooth Speaker",
    price: 1799.00,
    rating: 4.3,
    reviewCount: 892,
    category: "Electronics",
    brand: "SoundWave",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&q=80"],
    stock: 8,
    description: "Rugged portable speaker with deep bass and water resistance. Take your music anywhere with 12-hour battery life.",
    specs: ["IPX7 Waterproof", "12-hour battery", "360° sound", "Built-in microphone"],
    deliveryDays: 1,
    isPrime: true
  },
  {
    id: "p3",
    title: "Classic Leather Wallet",
    price: 799.00,
    rating: 4.0,
    reviewCount: 456,
    category: "Accessories",
    brand: "LeatherCraft",
    images: ["https://images.unsplash.com/photo-1627123423710-8fca5ffb5f04?w=900&q=80"],
    stock: 30,
    description: "Slim RFID-blocking leather wallet with 8 card slots. Handcrafted from genuine leather for lasting durability.",
    specs: ["RFID blocking", "8 card slots", "Genuine leather", "Slim design"],
    deliveryDays: 3
  },
  {
    id: "p4",
    title: "Ergonomic Office Chair",
    price: 8499.00,
    rating: 4.4,
    reviewCount: 2103,
    category: "Home",
    brand: "ComfortPro",
    images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80"],
    stock: 6,
    description: "Premium office chair with lumbar support and adjustable height. Designed for all-day comfort and productivity.",
    specs: ["Lumbar support", "Adjustable height", "Breathable mesh", "360° swivel"],
    deliveryDays: 5,
    isBestSeller: true
  },
  {
    id: "p5",
    title: "Stainless Steel Water Bottle 1L",
    price: 499.00,
    rating: 4.2,
    reviewCount: 3421,
    category: "Accessories",
    brand: "HydroMax",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900&q=80"],
    stock: 0,
    description: "Vacuum insulated water bottle — keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.",
    specs: ["Vacuum insulated", "BPA-free", "1L capacity", "Leak-proof lid"],
    deliveryDays: 2
  },
  {
    id: "p6",
    title: "Smart LED Desk Lamp",
    price: 1299.00,
    rating: 4.1,
    reviewCount: 687,
    category: "Home",
    brand: "BrightLife",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80"],
    stock: 12,
    description: "Adjustable lamp with warm/cool light modes and touch control. Features auto-dimming and eye-care technology.",
    specs: ["Touch control", "3 light modes", "USB charging port", "Auto-dimming"],
    deliveryDays: 2,
    isPrime: true
  },
  {
    id: "p7",
    title: "Mechanical Gaming Keyboard",
    price: 3299.00,
    rating: 4.6,
    reviewCount: 1876,
    category: "Electronics",
    brand: "GamerPro",
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80"],
    stock: 10,
    description: "RGB mechanical keyboard with customizable keys and tactile switches. Built for gaming and productivity.",
    specs: ["RGB backlight", "Mechanical switches", "N-key rollover", "Programmable keys"],
    deliveryDays: 1,
    isBestSeller: true,
    isPrime: true
  },
  {
    id: "p8",
    title: "Cotton Blend Throw Blanket",
    price: 1199.00,
    rating: 4.4,
    reviewCount: 923,
    category: "Home",
    brand: "CozyHome",
    images: ["https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80"],
    stock: 18,
    description: "Soft and cozy throw blanket perfect for any season. Machine washable and available in multiple colors.",
    specs: ["50x60 inches", "Machine washable", "Lightweight", "Hypoallergenic"],
    deliveryDays: 2
  }
];

// Mock reviews data
export const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p1",
    userName: "Sarah M.",
    rating: 5,
    title: "Amazing sound quality!",
    content: "These headphones are incredible. The noise cancellation works perfectly and the battery lasts all week on a single charge.",
    date: "2024-01-15",
    verified: true,
    helpful: 42
  },
  {
    id: "r2",
    productId: "p1",
    userName: "Mike T.",
    rating: 4,
    title: "Great but a bit pricey",
    content: "Love the sound and comfort, but the price is steep. Worth it if you use them daily.",
    date: "2024-01-10",
    verified: true,
    helpful: 18
  },
  {
    id: "r3",
    productId: "p7",
    userName: "Alex K.",
    rating: 5,
    title: "Best keyboard I've owned",
    content: "The tactile feedback is perfect for both gaming and typing. RGB looks amazing!",
    date: "2024-01-12",
    verified: true,
    helpful: 67
  }
];

// Mock Q&A data
export const QUESTIONS: Question[] = [
  {
    id: "q1",
    productId: "p1",
    userName: "John D.",
    question: "Are these compatible with both iOS and Android?",
    answer: "Yes, they work with both iOS and Android devices via Bluetooth.",
    answeredBy: "AudioTech Support",
    date: "2024-01-14"
  },
  {
    id: "q2",
    productId: "p1",
    userName: "Emma R.",
    question: "How long does charging take?",
    answer: "Full charge takes approximately 2 hours using the included USB-C cable.",
    answeredBy: "AudioTech Support",
    date: "2024-01-13"
  }
];
